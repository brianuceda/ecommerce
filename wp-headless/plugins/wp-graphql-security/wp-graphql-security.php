<?php

/**
 * Plugin Name:       WPGraphQL Security
 * Description:       Añade una capa de seguridad a WPGraphQL requiriendo una Secret Key para las peticiones.
 * Version:           1.0.0
 * Author:            Brian Uceda
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Añadir la página de ajustes al menú de GraphQL
function wpgqls_add_admin_menu() {
    add_submenu_page(
        'graphiql-ide',
        'WPGraphQL Security',
        'Security',
        'manage_options',
        'wpgraphql-security',
        'wpgqls_render_settings_page'
    );
}
add_action( 'admin_menu', 'wpgqls_add_admin_menu' );

// Registrar los ajustes del plugin
function wpgqls_register_settings() {
    // Registra un grupo de ajustes
    register_setting(
        'wpgqls_settings_group',
        'wpgqls_settings',
        'wpgqls_sanitize_settings'
    );

    // Añade una sección a la página de ajustes
    add_settings_section(
        'wpgqls_general_section',
        'Configuración de Seguridad',
        null,
        'wpgraphql-security'
    );

    // Añade el campo para activar/desactivar
    add_settings_field(
        'wpgqls_activate_security',
        'Activar Seguridad',
        'wpgqls_render_activate_checkbox',
        'wpgraphql-security',
        'wpgqls_general_section'
    );

    // Añade el campo para la Secret Key
    add_settings_field(
        'wpgqls_secret_key',
        'Secret Key',
        'wpgqls_render_secret_key_input',
        'wpgraphql-security',
        'wpgqls_general_section'
    );
}
add_action( 'admin_init', 'wpgqls_register_settings' );

// Función para sanitizar (limpiar) los datos antes de guardarlos
function wpgqls_sanitize_settings( $input ) {
    $new_input = [];
    if ( isset( $input['activate_security'] ) ) {
        $new_input['activate_security'] = 'on';
    }
    if ( isset( $input['secret_key'] ) ) {
        $new_input['secret_key'] = sanitize_text_field( $input['secret_key'] );
    }
    return $new_input;
}

// Renderizar los campos HTML de los ajustes
function wpgqls_render_activate_checkbox() {
    $options = get_option( 'wpgqls_settings' );
    $checked = isset( $options['activate_security'] ) && $options['activate_security'] === 'on';
    ?>
    <label>
        <input type="checkbox" name="wpgqls_settings[activate_security]" <?php checked( $checked, true ); ?> />
        <span>Activar la validación por Secret Key.</span>
    </label>
    <?php
}

// Renderizar el campo de la Secret Key y el botón para generar una nueva aleatoria
function wpgqls_render_secret_key_input() {
    $options = get_option( 'wpgqls_settings' );
    $secret_key = isset( $options['secret_key'] ) ? $options['secret_key'] : '';
    ?>
    <div style="display: flex; align-items: center; gap: 10px;">
        <input type="text" id="wpgqls_secret_key_input" name="wpgqls_settings[secret_key]" value="<?php echo esc_attr( $secret_key ); ?>" class="regular-text" style="font-family: monospace; width: 100%; max-width: 500px;" />
        <button type="button" id="wpgqls_generate_key_btn" class="button">Generar</button>
    </div>
    <p class="description">La clave secreta que se debe enviar en la cabecera <code>X-API-KEY</code>.</p>
    <?php
}

// Renderiza el contenido de la página de ajustes
function wpgqls_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields( 'wpgqls_settings_group' );
            do_settings_sections( 'wpgraphql-security' );
            submit_button( 'Guardar Cambios' );
            ?>
        </form>
    </div>
    <?php
}

// Cargar el script en la página de ajustes del plugin
function wpgqls_enqueue_admin_scripts( $hook_suffix ) {
    if ( 'graphql_page_wpgraphql-security' !== $hook_suffix ) {
        return;
    }
    wp_enqueue_script(
        'wpgqls-admin-script',
        plugin_dir_url( __FILE__ ) . 'admin.js',
        [],
        '1.0.0',
        true
    );
}
add_action( 'admin_enqueue_scripts', 'wpgqls_enqueue_admin_scripts' );

function wpgqls_block_unauthorized_requests() {
    $options = get_option( 'wpgqls_settings' );
    
    $is_active = isset( $options['activate_security'] ) && $options['activate_security'] === 'on';
    $expected_secret = isset( $options['secret_key'] ) ? $options['secret_key'] : '';

    if ( ! $is_active || empty( $expected_secret ) ) {
        return;
    }

    $sent_secret = isset( $_SERVER['HTTP_X_API_KEY'] ) ? $_SERVER['HTTP_X_API_KEY'] : '';

    if ( $sent_secret !== $expected_secret ) {
        header( 'Content-Type: application/json' );
        http_response_code( 401 );
        echo json_encode( [
            'errors' => [
                [ 'message' => 'Acceso no autorizado.' ],
            ],
        ] );
        exit;
    }
}
add_action( 'do_graphql_request', 'wpgqls_block_unauthorized_requests', 5 );
