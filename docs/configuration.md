# Configuration

All configuration lives in the consuming project's `drupal/composer.json` under `extra.project-scaffold`. Values set there override the defaults shipped in this package's own `composer.json`. After changing values, re-apply the scaffolding:

```bash
ddev composer project:scaffold   # apply with stored values
ddev composer project:init      # re-ask all questions, then apply
```

## Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `name` | yes* | – | Project code name (DDEV project name, hostnames, CI naming). |
| `title` | no | `name` | Human-readable project title (README). |
| `url` | yes* | – | Live URL of the website (stage file proxy origin, drush aliases, VRT reference, `NUXT_PUBLIC_IMAGE_BASE_URL`). |
| `monorepo` | no | `false` | `true` only in the ICMS development monorepo. Toggles workspace-specific behavior (`@workspace:*` bun dependencies, monorepo-only DDEV commands) and points the QA tooling (PHPUnit test suites, PHPCS, PHPStan, parallel-lint) at `packages/*` instead of `docroot/modules|themes/custom` (the `drupal-nuxt-platform` and `icms` asset/template packages are excluded from linting). |
| `deployment` | no | `platform.sh` | `platform.sh` or `local-only`. With `local-only` all hosting-related files are omitted/removed. |
| `drupal_spot` | yes* | `main-bvxea6i` | Machine name of the Single Point of Truth (SPOT) environment for database/config sync. |
| `routing.languages` | no | `["de", "fr", "it", "en"]` | Site languages, asked as a multiple-choice question at project creation. Drives the URL language prefix in the nginx/VCL route split and the root `Accept-Language` redirect (first entry = fallback target; with a single language `/` redirects unconditionally to it). |
| `routing.extra_drupal_paths` | no | `[]` | Additional path prefixes routed to the Drupal backend. Literal paths only (`[a-z0-9_/-]`, no regex, no trailing slash) — the templates add the language prefix and the path boundary. |
| `routing.extra_drupal_entities` | no | `[]` | Additional entity path stems whose `/add` and `/{id}/{operation}` routes go to the Drupal backend (like the built-in `node`, `product`, `taxonomy/term`, …). |
| `platformsh_config.region` | no | `ch-1` | Platform.sh region. |
| `platformsh_config.project_id` | no | `""` | Platform.sh project ID (drush site aliases). |
| `runtime.php_version` | yes* | `8.3` | PHP version (DDEV, Upsun, CI). |
| `runtime.db_version` | yes* | `10.11` | MariaDB version (DDEV, Upsun). |
| `runtime.node_version` | no | `22` | Node.js version of the Upsun frontend app. |
| `runtime.elasticsearch_version` | no | `null` | Set to `8` to enable the local Elasticsearch service (or run `make service-elasticsearch`). |
| `runtime.memcached` | no | `true` | Enables the local memcached service. |
| `runtime.php_memory_limit` | no | `512M` | Local PHP memory limit. |
| `runtime.php_upload_limit` | no | `100M` | Local PHP upload/post size limit. |
| `workflows.update` | no | `true` | Ship the `update.yml` GitHub workflow (composer + bun updates as PR). |
| `workflows.upgrade` | no | `true` | Ship the `upgrade.yml` GitHub workflow (payload-driven upgrade operations as PR). |
| `workflows.vrt` | no | `true` | Ship the visual regression testing workflow. |
| `workflows.phpunit` | no | `false` | Ship the PHPCS/PHPUnit testing workflows. |
| `workflows.frontend` | no | `false` | Ship the frontend testing workflow (prettier, ESLint, Vitest, `vue-tsc`, on plain bun without DDEV). Called from the `testing.yml` umbrella, so it only runs on pull requests where `workflows.phpunit` is enabled too. Opt-in like `workflows.phpunit`: enable it once the project's frontend passes `make frontend-lint` and `make frontend-test`. |
| `workflows.runner` | no | `ubuntu-latest` | GitHub Actions runner label for DDEV-based jobs. |
| `ai.claude` | no | `true` | Ship `.claude/settings.json` (iqual Claude plugin marketplace). Together with `ai.agents`, also ships a `CLAUDE.md` that imports `AGENTS.md`. |
| `ai.agents` | no | `true` | Ship the `AGENTS.md` agent instruction file (replace-mode: managed, overwritten on every scaffold run — project-specific knowledge belongs in `docs/` and `.claude/skills/`, not in the file itself). |
| `ai.copilot` | no | `true` | Ship the Copilot coding-agent setup workflow. In the monorepo (`monorepo: true`), this also provisions a full DDEV + Drupal + Nuxt stack (from-scratch `drush si --existing-config` install via `./.github/actions/install-local` with `site_install: true`, seeded with `icms_demo_content`) instead of just installing agent skills. |

\* Required variables are prompted interactively (see [`questions.json`](../questions.json)) and persisted back to `composer.json`. In non-interactive runs, missing required values abort the scaffolding.

> [!NOTE]
> Since `iqual/project-scaffold` 2.0, a **list** value in the project's `composer.json`
> replaces a package default wholesale (maps still merge recursively, project wins per
> key), so a project can shrink or empty a list. Defaults for list variables live in the
> templates (`|default([...])`) and, where asked interactively, in `questions.json` —
> like `routing.languages` does.

## Asset modes

| Mode | Directory | Behavior |
| --- | --- | --- |
| `add` | [`assets/add`](../assets/add) | Created only if missing — client-owned afterwards (e.g. `.platform/routes.yaml`, per-environment `settings.*.php`). |
| `replace` | [`assets/replace`](../assets/replace) | Fully managed, overwritten on every scaffold run (e.g. `Makefile`, `.ddev/config.yaml`, `.platform/config.vcl`, CI workflows, `README.md`, `AGENTS.md`, `CLAUDE.md`). A template that renders empty (disabled feature flag) deletes the file. |
| `merge` | [`assets/merge`](../assets/merge) | Structurally merged, preserving local additions and comments (root/`drupal/`/`frontend/` `.gitignore`, `.gitattributes`, `.platform/applications.yaml`, `.platform/services.yaml`, `.claude/settings.json`, VRT config). |

## Overriding files per project

To take ownership of a file managed by this package, either:

* **Ignore it** via root-level glob patterns in the project's `composer.json` — matched destinations are skipped for all asset packages (patterns match the destination path relative to the project root, without any `.twig` suffix):

  ```json
  "extra": {
      "project-scaffold": {
          "ignore-files": ["AGENTS.md", "README.md"]
      }
  }
  ```

  Prefer this sparingly: ignored files no longer receive platform updates. In particular, project-specific documentation belongs in `docs/` (and project-specific skills in `.claude/skills/`) rather than in an ignored copy of a managed file.

* **Shadow it** from a later-listed asset package containing the same relative source path (a `.twig` and a plain source targeting the same destination are detected as an override collision — the later package wins).

For DDEV configuration, prefer DDEV's own `config.*.yaml` override files instead of shadowing `config.yaml`.
