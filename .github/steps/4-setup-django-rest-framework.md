## Step 4: Wire API hosting for the multi-tier application

In this step, you will finalize API hosting for your **multi-tier application**:

- Keep backend API on port `8000`.
- Build Codespaces-aware API URL behavior using `$CODESPACE_NAME`.
- Validate endpoints with `curl`.

### :keyboard: Activity: Configure API base URL and host support

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's configure the Node.js API for Codespaces and localhost.
>
> - Backend runs on port 8000
> - Build API base URL with $CODESPACE_NAME when available:
>   https://$CODESPACE_NAME-8000.app.github.dev
> - Keep localhost support when $CODESPACE_NAME is not set
> - Verify /api/users and /api/activities with curl
> ```

1. Commit and push your changes to `build-octofit-app`.

1. Wait for Mona to validate and share the next step.

<details>
<summary>Having trouble? 🤷</summary><br/>

Verify `octofit-tracker/backend/src/server.ts` includes:

- `CODESPACE_NAME`
- `-8000.app.github.dev`

</details>
