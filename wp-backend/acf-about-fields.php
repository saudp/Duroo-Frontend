<?php
/**
 * ACF Field Group: About Page Content
 *
 * Registered locally in PHP (not via the ACF admin UI) so it's version-controlled
 * and deploys with the theme/plugin instead of living only in the database.
 *
 * Content is exposed to Next.js via a custom REST endpoint — see rest-about-endpoint.php
 *
 * Requires: Advanced Custom Fields PRO (for the Options Page feature)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/**
 * 1. Register the Options Page
 *
 * We use an Options Page rather than attaching fields to a WP "Page" post
 * because this is singleton content — there is only ever one About page,
 * so there's no need to couple the field group to a specific post ID or slug.
 */
if ( function_exists( 'acf_add_options_page' ) ) {
	acf_add_options_page( array(
		'page_title' => 'About Page Content',
		'menu_title' => 'About Page',
		'menu_slug'  => 'about-page-settings',
		'capability' => 'edit_posts',
		'icon_url'   => 'dashicons-book-alt',
		'position'   => 21, // Just below Pages in the admin menu.
	) );
}

/**
 * 2. Register the Field Group
 *
 * Structure: one ACF Group field per page section. This keeps the field
 * editor screen readable and maps 1:1 to the components on the Next.js side.
 */
if ( function_exists( 'acf_add_local_field_group' ) ) :

	acf_add_local_field_group( array(
		'key'      => 'group_about_page_content',
		'title'    => 'About Page Content',
		'location' => array(
			array(
				array(
					'param'    => 'options_page',
					'operator' => '==',
					'value'    => 'about-page-settings',
				),
			),
		),
		'fields'   => array(

			// ---------------------------------------------------------
			// SECTION 1: HERO
			// ---------------------------------------------------------
			array(
				'key'          => 'field_about_hero',
				'label'        => 'Hero — Brand Tagline',
				'name'         => 'hero',
				'type'         => 'group',
				'instructions' => 'The reusable brand tagline. Kept as 3 separate lines so each can be staggered/animated independently on the frontend.',
				'sub_fields'   => array(
					array(
						'key'          => 'field_hero_line_1',
						'label'        => 'Line 1',
						'name'         => 'line_1',
						'type'         => 'text',
						'default_value' => 'Two generations.',
					),
					array(
						'key'          => 'field_hero_line_2',
						'label'        => 'Line 2',
						'name'         => 'line_2',
						'type'         => 'text',
						'default_value' => 'Two loud voices.',
					),
					array(
						'key'          => 'field_hero_line_3',
						'label'        => 'Line 3 (payoff line)',
						'name'         => 'line_3',
						'type'         => 'text',
						'default_value' => 'One thread that connects them.',
					),
					array(
						'key'          => 'field_hero_bg_image',
						'label'        => 'Background Image (optional)',
						'name'         => 'background_image',
						'type'         => 'image',
						'instructions' => 'Optional. If left empty, the hero renders as pure typography on the paper/ink background.',
						'return_format' => 'array',
						'preview_size' => 'medium',
					),
				),
			),

			// ---------------------------------------------------------
			// SECTION 2: ORIGIN STORY (Raigad / Konkan / Maratha legacy)
			// ---------------------------------------------------------
			array(
				'key'        => 'field_about_origin',
				'label'      => 'Origin Story',
				'name'       => 'origin_story',
				'type'       => 'group',
				'sub_fields' => array(
					array(
						'key'          => 'field_origin_eyebrow',
						'label'        => 'Eyebrow Label',
						'name'         => 'eyebrow',
						'type'         => 'text',
						'default_value' => 'OUR STORY',
					),
					array(
						'key'          => 'field_origin_heading',
						'label'        => 'Heading',
						'name'         => 'heading',
						'type'         => 'text',
						'default_value' => 'Rooted in the Konkan.',
					),
					array(
						'key'          => 'field_origin_body',
						'label'        => 'Body Copy',
						'name'         => 'body',
						'type'         => 'wysiwyg',
						'tabs'         => 'text',
						'media_upload' => 0,
						'toolbar'      => 'basic',
					),
					array(
						'key'          => 'field_origin_image',
						'label'        => 'Image (optional)',
						'name'         => 'image',
						'type'         => 'image',
						'instructions' => 'Raigad fort / Konkan coastline / heritage visual. Optional — falls back to a typographic moment if empty.',
						'return_format' => 'array',
						'preview_size' => 'medium',
					),
				),
			),

			// ---------------------------------------------------------
			// SECTION 3: THE NAME (Durafsha)
			// ---------------------------------------------------------
			array(
				'key'        => 'field_about_name_story',
				'label'      => 'The Name — Durafsha',
				'name'       => 'name_story',
				'type'       => 'group',
				'sub_fields' => array(
					array(
						'key'          => 'field_name_eyebrow',
						'label'        => 'Eyebrow Label',
						'name'         => 'eyebrow',
						'type'         => 'text',
						'default_value' => 'THE NAME',
					),
					array(
						'key'          => 'field_name_heading',
						'label'        => 'Heading',
						'name'         => 'heading',
						'type'         => 'text',
					),
					array(
						'key'          => 'field_name_body',
						'label'        => 'Body Copy',
						'name'         => 'body',
						'type'         => 'wysiwyg',
						'tabs'         => 'text',
						'media_upload' => 0,
						'toolbar'      => 'basic',
					),
					array(
						'key'          => 'field_name_image',
						'label'        => 'Image (optional)',
						'name'         => 'image',
						'type'         => 'image',
						'instructions' => 'Optional. A pearl/texture detail shot works well here if no personal photo is being used.',
						'return_format' => 'array',
						'preview_size' => 'medium',
					),
				),
			),

			// ---------------------------------------------------------
			// SECTION 4: PHILOSOPHY (the tagline gets its full moment)
			// ---------------------------------------------------------
			array(
				'key'        => 'field_about_philosophy',
				'label'      => 'Philosophy',
				'name'       => 'philosophy',
				'type'       => 'group',
				'sub_fields' => array(
					array(
						'key'          => 'field_philosophy_eyebrow',
						'label'        => 'Eyebrow Label',
						'name'         => 'eyebrow',
						'type'         => 'text',
						'default_value' => 'OUR PHILOSOPHY',
					),
					array(
						'key'          => 'field_philosophy_intro',
						'label'        => 'Intro Copy (before the tagline restatement)',
						'name'         => 'intro',
						'type'         => 'wysiwyg',
						'tabs'         => 'text',
						'media_upload' => 0,
						'toolbar'      => 'basic',
					),
					array(
						'key'          => 'field_philosophy_bg_image',
						'label'        => 'Background Image (optional)',
						'name'         => 'background_image',
						'type'         => 'image',
						'return_format' => 'array',
						'preview_size' => 'medium',
					),
				),
			),

			// ---------------------------------------------------------
			// SECTION 5: CLOSING CTA
			// ---------------------------------------------------------
			array(
				'key'        => 'field_about_cta',
				'label'      => 'Closing CTA',
				'name'       => 'cta',
				'type'       => 'group',
				'sub_fields' => array(
					array(
						'key'          => 'field_cta_heading',
						'label'        => 'Heading',
						'name'         => 'heading',
						'type'         => 'text',
						'default_value' => 'Wear the Story.',
					),
					array(
						'key'          => 'field_cta_button_text',
						'label'        => 'Button Text',
						'name'         => 'button_text',
						'type'         => 'text',
						'default_value' => 'Shop the Collection',
					),
					array(
						'key'          => 'field_cta_button_link',
						'label'        => 'Button Link',
						'name'         => 'button_link',
						'type'         => 'link',
					),
				),
			),
		),
	) );

endif;
