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
| `routing.languages` | no | `["de", "fr", "it", "en"]` | Site languages. Drives the URL language prefix in the nginx/VCL route split and the root `Accept-Language` redirect (first entry = fallback target; with a single language `/` redirects unconditionally to it). |
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
| `workflows.runner` | no | `ubuntu-latest` | GitHub Actions runner label for DDEV-based jobs. |
| `ai.claude` | no | `true` | Ship `.claude/settings.json` (iqual Claude plugin marketplace). |
| `ai.agents` | no | `true` | Reserved for `AGENTS.md` management (not shipped yet). |
| `ai.copilot` | no | `true` | Ship the Copilot coding-agent setup workflow. In the monorepo (`monorepo: true`), this also provisions a full DDEV + Drupal + Nuxt stack (from-scratch `drush si --existing-config` install via `./.github/actions/install-local` with `site_install: true`, seeded with `icms_demo_content`) instead of just installing agent skills. |

\* Required variables are prompted interactively (see [`questions.json`](../questions.json)) and persisted back to `composer.json`. In non-interactive runs, missing required values abort the scaffolding.

> [!WARNING]
> Never give a **list** variable a non-empty default in this package's `composer.json`:
> project values are merged over the defaults with `array_replace_recursive()`, which
> merges lists *by index* (a project's `["de", "fr"]` over a default `["de", "fr", "it",
> "en"]` yields `["de", "fr", "it", "en"]`). Put list defaults in the templates instead
> (`|default([...])`), like `routing.languages` does.

## Asset modes

| Mode | Directory | Behavior |
| --- | --- | --- |
| `add` | [`assets/add`](../assets/add) | Created only if missing — client-owned afterwards (e.g. `README.md`, `.platform/routes.yaml`, `drupal/.gitignore`, per-environment `settings.*.php`). |
| `replace` | [`assets/replace`](../assets/replace) | Fully managed, overwritten on every scaffold run (e.g. `Makefile`, `.ddev/config.yaml`, `.platform/config.vcl`, CI workflows). A template that renders empty (disabled feature flag) deletes the file. |
| `merge` | [`assets/merge`](../assets/merge) | Structurally merged, preserving local additions and comments (`.gitignore`, `.gitattributes`, `.platform/applications.yaml`, `.platform/services.yaml`, `.claude/settings.json`, VRT config). |

## Overriding files per project

To take ownership of a file managed by this package, shadow it from a later-listed asset package containing the same relative source path (with the current plugin version the source filename must match **exactly**, including the `.twig` suffix). Disabling scaffolding per file is a pending feature upstream.

For DDEV configuration, prefer DDEV's own `config.*.yaml` override files instead of shadowing `config.yaml`.
