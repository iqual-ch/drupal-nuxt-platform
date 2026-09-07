#!/usr/bin/env bash
# Platform.sh post_deploy hook of the drupal app. Managed by iqual/drupal-nuxt-platform.
set -euo pipefail

if [ -n "${DRUPAL_NO_DRUSH_DEPLOY:-}" ]; then
  echo "DRUPAL_NO_DRUSH_DEPLOY is set. Skipping Drupal post-deploy steps."
  exit 0
fi

if [ -z "$(drush status --fields=bootstrap)" ]; then
  echo "Drupal not installed. Skipping Drupal post-deploy steps."
  exit 0
fi

drush icms:post-deploy
echo "Post-deploy hook finished at $(date -u '+%Y-%m-%d %H:%M:%S UTC')."
