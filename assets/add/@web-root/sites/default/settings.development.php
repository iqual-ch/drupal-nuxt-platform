<?php

use Platformsh\ConfigReader\Config;

$platformsh = new Config();

if ($platformsh->inRuntime()) {
    $route = $platformsh->getPrimaryRoute();
    $base_url = rtrim($route['url'], '/');
    $config['nuxt_multi_cache.settings']['endpoint'] = $base_url . '/api/multi-cache';
    $config['nuxt_multi_cache.settings']['token'] = getenv('NUXT_MULTI_CACHE_API_AUTHORIZATION_TOKEN');
    $config['nuxt_multi_cache.settings']['frontend'] = $base_url;
}

## Custom Settings for DEV Environment

# Environment Indicator
$config['environment_indicator.indicator']['bg_color'] = '#E95E26';
$config['environment_indicator.indicator']['fg_color'] = '#000000';
$config['environment_indicator.indicator']['name'] = getenv('PLATFORM_BRANCH') . " - " . getenv('PLATFORM_ENVIRONMENT_TYPE');

$settings['file_private_path'] = '../files-private/';

// Enable CSS and JS aggregation.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;

// This will allow module config per environment.
$config['config_split.config_split.live']['status'] = TRUE;

// Set this temporarily to TRUE to import ignored config such as webforms.
$settings['config_ignore_deactivate'] = FALSE;

// Symfony Mailer Lite
$config['symfony_mailer_lite.symfony_mailer_lite_transport.dsn']['configuration']['dsn'] = 'smtp://' . getenv('PLATFORM_SMTP_HOST') . ':25';
