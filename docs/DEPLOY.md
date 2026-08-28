# Auto-deploy to the VPS (GitHub Actions → Plesk over SSH)

Once set up, every push to the branch builds the site in GitHub's cloud and rsyncs
the finished files to `httpdocs` on the VPS. No more manual zip uploads.

The workflow (`.github/workflows/deploy.yml`) is already in the repo. It stays inert
(build-only) until you add the secrets below — so nothing deploys by accident.

## One-time setup

### 1. Create a deploy SSH key (on your Mac)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/belegendary_deploy -N "" -C "github-deploy"
```
This makes two files: `belegendary_deploy` (private) and `belegendary_deploy.pub` (public).

### 2. Authorize the key on the VPS
SSH in as you normally do, then add the **public** key to the deploy user:
```bash
cat ~/.ssh/belegendary_deploy.pub | ssh belegen_ftp@belegendary.org 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```
(Run that from your Mac; it appends the public key on the server.)

### 3. Add the secrets in GitHub
Repo → **Settings → Secrets and variables → Actions → New repository secret**. Add:

| Secret | Value |
|---|---|
| `DEPLOY_SSH_KEY` | the **private** key — paste the full contents of `~/.ssh/belegendary_deploy` |
| `DEPLOY_HOST` | `belegendary.org` (or the server IP) |
| `DEPLOY_USER` | `belegen_ftp` |
| `DEPLOY_PATH` | `/var/www/vhosts/belegendary.org/httpdocs` |
| `DEPLOY_PORT` | `22` (only if your SSH port differs) |

### 4. Test
Push any change (or run the workflow manually: repo → **Actions → Deploy to VPS → Run workflow**).
Watch it build and deploy; then check belegendary.org.

## Notes
- `rsync --delete` keeps the server exactly matching the build, but **never** touches
  `.well-known` (used for your SSL certificate).
- The build runs on GitHub's runners (Node 22), so the VPS doesn't need Node.
- To pause auto-deploy, just remove the `DEPLOY_SSH_KEY` secret — the workflow falls
  back to build-only.

## Manual server-side steps (NOT handled by auto-deploy)

The rsync pipeline above only syncs the built site into `httpdocs`. It does **not**
touch nginx/Apache configuration, so anything that lives in Plesk's directive boxes
has to be pasted in by hand, once, on the server. Tracking those here so they don't
get lost:

| Item | Status | What to do | Source in repo |
|---|---|---|---|
| **HSTS header** | ⏳ Pending | Semrush flags "No HSTS support" on `belegendary.org`. Paste the `Strict-Transport-Security` directive into Plesk → Domains → belegendary.org → Apache & nginx Settings → *Additional nginx directives* → Apply. | `redirects/plesk-nginx-hsts.conf` |
| **gzip/brotli compression** | (verify) | Companion nginx directive block; paste alongside HSTS if not already present. | `redirects/plesk-nginx-compression.conf` |

Once the HSTS directive is live, re-run the Semrush audit (or `curl -sI https://belegendary.org | grep -i strict`) to confirm the header is served, then mark this row done.

## Post-deploy smoke check (run from an UNRESTRICTED network)

A green Actions run only proves the build + rsync succeeded — it doesn't prove the
served HTML looks right. These curls fetch the live pages and assert on the response.

> ⚠️ Run these from your own machine or any box with normal internet — **not** from a
> Claude Code web session. That sandbox routes outbound through a policy egress proxy
> that blocks `belegendary.org` and `hbr.org` (403 CONNECT), so the requests return an
> empty body and any `grep` on it is a false result, not a real reading.

```bash
# 1. Site is up and serving the page (expect: HTTP/2 200)
curl -sI "https://www.belegendary.org/executive-team-building/" | head -1

# 2. Research citations are FOLLOWED, not nofollow'd (expect: 0)
#    (empty body from a blocked/failed request also prints 0 — so only trust this
#     when curl #1 returned 200 and the body is non-empty)
curl -s "https://www.belegendary.org/executive-team-building/" | grep -c nofollow

# 3. HBR citation slug is the corrected one, not the broken 'unravelsand' (expect: 200)
curl -sI "https://hbr.org/2015/03/why-strategy-execution-unravels-and-what-to-do-about-it" | head -1

# 4. HSTS header is being served once the nginx directive is applied (expect: a
#    strict-transport-security line; nothing until the manual step above is done)
curl -sI "https://belegendary.org" | grep -i strict-transport-security

# 5. LFS ↔ demo cross-links resolve in BOTH directions (expect: ≥1 on each line).
#    The demo (demo.belegendary.org) is a separate site/repo deployed by Vercel, so
#    its half only passes once Vercel has finished building the lfs-demo push — a
#    green Actions run on THIS repo says nothing about the demo's deploy.
#    Main site → demo:
curl -s "https://www.belegendary.org/elfs/"           | grep -c "demo.belegendary.org"
curl -s "https://www.belegendary.org/teams/team-lfs/" | grep -c "demo.belegendary.org"
#    Demo → LFS pages:
curl -s "https://demo.belegendary.org/" | grep -c "belegendary.org/elfs/"
curl -s "https://demo.belegendary.org/" | grep -c "teams/team-lfs/"
```

If #1 isn't `200`, stop — the rest are meaningless. If #2 isn't `0`, a `nofollow`
crept back into the research citations. #4 stays empty until the HSTS manual step is
applied on the server. In #5, every line should print a non-zero count; a `0` on the
last two lines usually just means Vercel hasn't finished deploying the demo yet —
re-run after a minute before treating it as a broken link. (As with #2, a `0` from a
blocked or failed request is a false pass, so only trust these on a normal network.)
