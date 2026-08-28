<?php
/**
 * REST API: /wp-json/duroo/v1/about
 *
 * A custom, purpose-built endpoint rather than relying on the generic
 * ACF-to-REST-API plugin. Reasons:
 *   1. Full control over the exact JSON shape returned to Next.js
 *      (snake_case → camelCase mapping happens once, here, not repeated
 *      in every frontend fetch call).
 *   2. No dependency on a third-party plugin just to expose Options Page fields.
 *   3. Response is cache-friendly (see transient wrapper below).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'duroo/v1', '/about', array(
		'methods'             => 'GET',
		'callback'            => 'duroo_get_about_page_data',
		'permission_callback' => '__return_true', // Public read-only content.
	) );
} );

function duroo_get_about_page_data() {

	$cache_key = 'duroo_about_page_data';
	$cached    = get_transient( $cache_key );

	if ( false !== $cached ) {
		return rest_ensure_response( $cached );
	}

	if ( ! function_exists( 'get_field' ) ) {
		return new WP_Error(
			'acf_missing',
			'Advanced Custom Fields is not active.',
			array( 'status' => 500 )
		);
	}

	// Pulls straight from the Options Page ("option") rather than a post ID.
	$fields = get_fields( 'option' );

	if ( empty( $fields ) ) {
		return new WP_Error(
			'no_content',
			'About page content has not been set up yet in wp-admin → About Page.',
			array( 'status' => 404 )
		);
	}

	$response = array(
		'hero'        => array(
			'lines'           => array(
				$fields['hero']['line_1'] ?? '',
				$fields['hero']['line_2'] ?? '',
				$fields['hero']['line_3'] ?? '',
			),
			'backgroundImage' => duroo_format_image( $fields['hero']['background_image'] ?? null ),
		),
		'originStory' => array(
			'eyebrow' => $fields['origin_story']['eyebrow'] ?? '',
			'heading' => $fields['origin_story']['heading'] ?? '',
			'body'    => $fields['origin_story']['body'] ?? '',
			'image'   => duroo_format_image( $fields['origin_story']['image'] ?? null ),
		),
		'nameStory'   => array(
			'eyebrow' => $fields['name_story']['eyebrow'] ?? '',
			'heading' => $fields['name_story']['heading'] ?? '',
			'body'    => $fields['name_story']['body'] ?? '',
			'image'   => duroo_format_image( $fields['name_story']['image'] ?? null ),
		),
		'philosophy'  => array(
			'eyebrow'         => $fields['philosophy']['eyebrow'] ?? '',
			'intro'           => $fields['philosophy']['intro'] ?? '',
			'backgroundImage' => duroo_format_image( $fields['philosophy']['background_image'] ?? null ),
		),
		'cta'         => array(
			'heading'    => $fields['cta']['heading'] ?? '',
			'buttonText' => $fields['cta']['button_text'] ?? '',
			'buttonLink' => $fields['cta']['button_link']['url'] ?? '/shop',
		),
	);

	// Cache for 1 hour. About page content changes rarely — this takes load
	// off wp-admin/MySQL and pairs with Next.js ISR revalidation on the frontend.
	set_transient( $cache_key, $response, HOUR_IN_SECONDS );

	return rest_ensure_response( $response );
}

/**
 * Normalizes an ACF image field (array return format) into a lean shape.
 * Returns null if no image was set — the frontend uses this to decide
 * whether to render a photo or fall back to a typographic treatment.
 */
function duroo_format_image( $image_field ) {
	if ( empty( $image_field ) || ! is_array( $image_field ) ) {
		return null;
	}

	return array(
		'url'    => $image_field['url'] ?? '',
		'alt'    => $image_field['alt'] ?? '',
		'width'  => $image_field['width'] ?? 0,
		'height' => $image_field['height'] ?? 0,
	);
}

/**
 * Bust the cache automatically whenever the Options Page is saved in wp-admin.
 */
add_action( 'acf/save_post', function ( $post_id ) {
	if ( 'options' === $post_id ) {
		delete_transient( 'duroo_about_page_data' );
	}
}, 20 );
