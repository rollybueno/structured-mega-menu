<?php
/**
 * Custom REST API controller.
 *
 * @package StructuredMegaMenu
 */

namespace StructuredMegaMenu;

defined( 'ABSPATH' ) || exit;

/**
 * Registers custom REST routes when Core endpoints are insufficient.
 */
class REST_Controller {

	/**
	 * REST namespace.
	 *
	 * @var string
	 */
	const NAMESPACE = 'structured-mega-menu/v1';

	/**
	 * Hooks REST registration.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
	}

	/**
	 * Registers custom REST routes.
	 *
	 * @return void
	 */
	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			'/schema',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_schema_definition' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/column-types',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_column_types' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/icons',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'get_icons' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/link-search',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => array( __CLASS__, 'link_search' ),
				'permission_callback' => array( __CLASS__, 'can_manage' ),
				'args'                => array(
					'search'   => array(
						'description'       => __( 'Search term.', 'structured-mega-menu' ),
						'type'              => 'string',
						'required'          => false,
						'sanitize_callback' => 'sanitize_text_field',
					),
					'per_page' => array(
						'description'       => __( 'Results per page.', 'structured-mega-menu' ),
						'type'              => 'integer',
						'default'           => 20,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);

		register_rest_route(
			self::NAMESPACE,
			'/settings',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( __CLASS__, 'get_settings' ),
					'permission_callback' => array( __CLASS__, 'can_manage' ),
				),
				array(
					'methods'             => \WP_REST_Server::EDITABLE,
					'callback'            => array( __CLASS__, 'update_settings' ),
					'permission_callback' => array( __CLASS__, 'can_manage' ),
					'args'                => array(
						'deleteDataOnUninstall' => array(
							'type'              => 'boolean',
							'required'          => false,
							'sanitize_callback' => 'rest_sanitize_boolean',
						),
					),
				),
			)
		);
	}

	/**
	 * Permission callback for management endpoints.
	 *
	 * @return bool
	 */
	public static function can_manage() {
		return Capabilities::current_user_can_manage();
	}

	/**
	 * Returns schema defaults and constraints for the admin client.
	 *
	 * @return \WP_REST_Response
	 */
	public static function get_schema_definition() {
		return rest_ensure_response(
			array(
				'version'       => SMM_SCHEMA_VERSION,
				'maxColumns'    => SMM_MAX_COLUMNS,
				'defaults'      => Schema::get_default(),
				'panelWidths'   => Schema::get_panel_widths(),
				'openingModes'  => Schema::get_opening_modes(),
				'mobileModes'   => Schema::get_mobile_modes(),
				'layoutPresets' => Schema::get_layout_presets(),
			)
		);
	}

	/**
	 * Returns registered column type definitions.
	 *
	 * @return \WP_REST_Response
	 */
	public static function get_column_types() {
		$registry = Plugin::instance()->get_column_registry();

		return rest_ensure_response( $registry->get_client_definitions() );
	}

	/**
	 * Returns the built-in icon registry for the picker.
	 *
	 * @return \WP_REST_Response
	 */
	public static function get_icons() {
		$icons   = Icons::all();
		$payload = array();

		foreach ( $icons as $slug => $icon ) {
			$payload[] = array(
				'slug'  => $slug,
				'label' => isset( $icon['label'] ) ? $icon['label'] : $slug,
				'group' => isset( $icon['group'] ) ? $icon['group'] : 'general',
			);
		}

		return rest_ensure_response( $payload );
	}

	/**
	 * Searches public content for the link picker.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function link_search( $request ) {
		$search   = $request->get_param( 'search' );
		$per_page = max( 1, min( 50, (int) $request->get_param( 'per_page' ) ) );
		$results  = array();

		$query_args = array(
			'post_type'      => 'any',
			'post_status'    => 'publish',
			'posts_per_page' => $per_page,
			'orderby'        => 'relevance',
			's'              => is_string( $search ) ? $search : '',
		);

		// Limit to publicly queryable types.
		$types = get_post_types(
			array(
				'public'       => true,
				'show_in_rest' => true,
			),
			'names'
		);

		if ( ! empty( $types ) ) {
			$query_args['post_type'] = array_values( $types );
		}

		$query = new \WP_Query( $query_args );

		foreach ( $query->posts as $post ) {
			$results[] = array(
				'id'    => (int) $post->ID,
				'title' => html_entity_decode( get_the_title( $post ), ENT_QUOTES, get_bloginfo( 'charset' ) ),
				'url'   => get_permalink( $post ),
				'type'  => get_post_type( $post ),
				'kind'  => 'post-type',
			);
		}

		if ( is_string( $search ) && '' !== $search ) {
			$terms = get_terms(
				array(
					'taxonomy'   => get_taxonomies( array( 'public' => true ), 'names' ),
					'search'     => $search,
					'hide_empty' => false,
					'number'     => 10,
				)
			);

			if ( ! is_wp_error( $terms ) ) {
				foreach ( $terms as $term ) {
					$link = get_term_link( $term );
					if ( is_wp_error( $link ) ) {
						continue;
					}
					$results[] = array(
						'id'    => (int) $term->term_id,
						'title' => $term->name,
						'url'   => $link,
						'type'  => $term->taxonomy,
						'kind'  => 'taxonomy',
					);
				}
			}
		}

		return rest_ensure_response( $results );
	}

	/**
	 * Returns plugin settings.
	 *
	 * @return \WP_REST_Response
	 */
	public static function get_settings() {
		return rest_ensure_response(
			array(
				'deleteDataOnUninstall' => (bool) get_option( SMM_OPTION_DELETE_DATA, false ),
			)
		);
	}

	/**
	 * Updates plugin settings.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response
	 */
	public static function update_settings( $request ) {
		if ( null !== $request->get_param( 'deleteDataOnUninstall' ) ) {
			update_option(
				SMM_OPTION_DELETE_DATA,
				(bool) $request->get_param( 'deleteDataOnUninstall' ),
				false
			);
		}

		return self::get_settings();
	}
}
