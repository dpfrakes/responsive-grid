<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.dpfrakes.net/
 * @since             1.0.0
 * @package           Responsive_Grid
 *
 * @wordpress-plugin
 * Plugin Name:       Responsive Grid
 * Plugin URI:        https://github.com/natgeosociety/
 * Description:       Simple responsive grid layout for Visual Editor.
 * Version:           1.0.0
 * Author:            Dan Frakes
 * Author URI:        https://www.dpfrakes.net/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       responsive-grid
 * Domain Path:       /languages
 */

define( 'RG_VERSION', '1.0' );

add_action( 'plugins_loaded', 'responsive_grid_text_domain' );
/**
 * Load plugin textdomain.
 *
 * @since 0.1
 */
function responsive_grid_text_domain() {
	load_plugin_textdomain( 'responsive-grid' );
}

if ( ! function_exists( 'rg_shortcodes_register_shortcode' ) ) {
	add_action( 'init', 'rg_shortcodes_register_shortcode' );
	function rg_shortcodes_register_shortcode() {
		add_shortcode( 'rg_column', 'rg_columns_shortcode' );
	}
}

if ( ! function_exists( 'rg_add_shortcode_button' ) ) {
	add_action( 'admin_init', 'rg_add_shortcode_button' );
	/*
	 * Set it up so we can register our TinyMCE button
	 */
	function rg_add_shortcode_button() {
		// check user permissions
		if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
			return;
		}

		// check if WYSIWYG is enabled
		if ( get_user_option( 'rich_editing' ) == 'true') {
			add_filter( 'mce_external_plugins', 'rg_shortcodes_add_tinymce_plugin' );
			add_filter( 'mce_buttons', 'rg_shortcodes_register_button' );
		}
	}
}

if ( ! function_exists( 'rg_shortcodes_add_tinymce_plugin' ) ) {
	/*
	 * Register our tinyMCE button javascript
	 */
	function rg_shortcodes_add_tinymce_plugin( $plugin_array ) {
		$plugin_array['rg_shortcodes_button'] = plugins_url( '/js/button.js', __FILE__ );
		return $plugin_array;
	}
}

if ( ! function_exists( 'rg_shortcodes_register_button' ) ) {
	/*
	 * Register our TinyMCE button
	 */
	function rg_shortcodes_register_button( $buttons ) {
		array_push( $buttons, 'rg_shortcodes_button' );
		return $buttons;
	}
}

if ( ! function_exists( 'rg_translatable_strings' ) ) {
	add_action( 'admin_head','rg_translatable_strings', 0 );
	/*
	 * Add translatable strings.
	 */
	function rg_translatable_strings() {
		?>
		<script type="text/javascript">
			var rg_add_columns = '<?php esc_html_e( 'Add columns', 'lightweight-grid-columns' ); ?>';
			var rg_columns = '<?php esc_html_e( 'Columns', 'lightweight-grid-columns' ); ?>';
			var rg_desktop = '<?php esc_html_e( 'Desktop grid percentage', 'lightweight-grid-columns' ); ?>';
			var rg_tablet = '<?php esc_html_e( 'Tablet grid percentage', 'lightweight-grid-columns' ); ?>';
			var rg_mobile = '<?php esc_html_e( 'Mobile grid percentage', 'lightweight-grid-columns' ); ?>';
			var rg_content = '<?php esc_html_e( 'Content', 'lightweight-grid-columns' ); ?>';
			var rg_last = '<?php esc_html_e( 'Last column in row?', 'lightweight-grid-columns' ); ?>';
		</script>
		<?php
	}
}

if ( ! function_exists( 'rg_shortcodes_admin_css' ) ) {
	add_action( 'admin_enqueue_scripts', 'rg_shortcodes_admin_css' );
	/*
	 * Add our admin CSS
	 */
	function rg_shortcodes_admin_css() {
		wp_enqueue_style( 'rg-columns-admin', plugins_url('/css/admin.css', __FILE__) );
	}
}

if ( ! function_exists( 'rg_shortcodes_css' ) ) {
	add_action( 'wp_enqueue_scripts', 'rg_shortcodes_css', 99 );
	/*
	 * Add the unsemantic framework
	 */
	function rg_shortcodes_css() {
		wp_enqueue_style( 'rg-unsemantic-grid-responsive-tablet', plugins_url('/css/unsemantic-grid-responsive-tablet.css', __FILE__), array(), rg_VERSION, 'all' );
		wp_register_script( 'rg-matchHeight', plugins_url('/js/jquery.matchHeight-min.js', __FILE__), array( 'jquery' ), rg_VERSION, true );
	}
}

if ( ! function_exists( 'rg_columns_shortcode' ) ) {
	/*
	 * Create the output of the columns shortcode
	 */
	function rg_columns_shortcode( $atts , $content = null ) {
		extract( shortcode_atts(
			array(
				'grid' => '50',
				'tablet_grid' => '50',
				'mobile_grid' => '100',
				'last' => '',
				'class' => '',
				'style' => '',
				'equal_heights' => 'true',
				'id' => ''
			), $atts )
		);

		if ( 'true' == $equal_heights ) {
			wp_enqueue_script( 'rg-matchHeight' );
		}

		$content = sprintf(
			'<div %9$s class="rg-column rg-grid-parent %1$s %2$s %3$s %4$s %5$s"><div %6$s class="inside-grid-column">%7$s</div></div>%8$s',
			'rg-grid-' . intval( $grid ),
			'rg-tablet-grid-' . intval( $tablet_grid ),
			'rg-mobile-grid-' . intval( $mobile_grid ),
			( 'true' == $equal_heights ) ? 'rg-equal-heights' : '',
			esc_attr( $class ),
			( '' !== $style ) ? ' style="' . esc_attr( $style ) . '"' : '',
			do_shortcode( $content ),
			( 'true' == $last ) ? '<div class="rg-clear"></div>' : '',
			( '' !== $id ) ? 'id="' . esc_attr( $id ) . '"' : ''
		);

		return force_balance_tags( $content );
	}
}

if ( ! function_exists( 'rg_columns_helper' ) ) {
	add_filter( 'the_content', 'rg_columns_helper' );
	/*
	 * Fix the WP paragraph and <br /> issue with shortcodes
	 */
	function rg_columns_helper( $content ) {
	    $array = array (
	        '<p>[rg_column' => '[rg_column',
	        'rg_column]</p>' => 'rg_column]',
			'<br />[rg_column' => '[rg_column',
	        'rg_column]<br />' => 'rg_column]'
	    );

	    return strtr( $content, $array );
	}
}
