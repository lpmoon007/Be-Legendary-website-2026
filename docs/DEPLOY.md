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
