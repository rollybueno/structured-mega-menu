<?php
/**
 * Minimal WordPress API stubs for unit tests.
 *
 * @package StructuredMegaMenu
 */

// phpcs:ignoreFile

namespace {
	if ( ! function_exists( 'trailingslashit' ) ) {
		function trailingslashit( $string ) {
			return rtrim( (string) $string, '/\\' ) . '/';
		}
	}

	if ( ! function_exists( 'untrailingslashit' ) ) {
		function untrailingslashit( $string ) {
			return rtrim( (string) $string, '/\\' );
		}
	}

	if ( ! function_exists( 'sanitize_key' ) ) {
		function sanitize_key( $key ) {
			$key = strtolower( (string) $key );
			return preg_replace( '/[^a-z0-9_\-]/', '', $key );
		}
	}

	if ( ! function_exists( 'sanitize_html_class' ) ) {
		function sanitize_html_class( $class_name ) {
			$class_name = preg_replace( '/[^A-Za-z0-9_\-]/', '', (string) $class_name );
			return is_string( $class_name ) ? $class_name : '';
		}
	}

	if ( ! function_exists( 'sanitize_text_field' ) ) {
		function sanitize_text_field( $str ) {
			$str = (string) $str;
			$str = strip_tags( $str );
			$str = preg_replace( '/[\r\n\t]+/', ' ', $str );
			return trim( $str );
		}
	}

	if ( ! function_exists( 'sanitize_textarea_field' ) ) {
		function sanitize_textarea_field( $str ) {
			$str = (string) $str;
			$str = strip_tags( $str );
			return trim( $str );
		}
	}

	if ( ! function_exists( 'esc_url_raw' ) ) {
		function esc_url_raw( $url ) {
			$url = trim( (string) $url );
			if ( '' === $url ) {
				return '';
			}
			// Allow relative paths and common schemes used in menus.
			if ( 0 === strpos( $url, '/' ) || 0 === strpos( $url, '#' ) ) {
				return $url;
			}
			if ( preg_match( '#^(https?|mailto|tel):#i', $url ) ) {
				return filter_var( $url, FILTER_SANITIZE_URL ) ?: $url;
			}
			return '';
		}
	}

	if ( ! function_exists( 'esc_url' ) ) {
		function esc_url( $url ) {
			return esc_url_raw( $url );
		}
	}

	if ( ! function_exists( 'esc_html' ) ) {
		function esc_html( $text ) {
			return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
		}
	}

	if ( ! function_exists( 'esc_attr' ) ) {
		function esc_attr( $text ) {
			return htmlspecialchars( (string) $text, ENT_QUOTES, 'UTF-8' );
		}
	}

	if ( ! function_exists( 'esc_attr__' ) ) {
		function esc_attr__( $text ) {
			return esc_attr( $text );
		}
	}

	if ( ! function_exists( 'wp_strip_all_tags' ) ) {
		function wp_strip_all_tags( $string ) {
			return trim( strip_tags( (string) $string ) );
		}
	}

	if ( ! function_exists( 'absint' ) ) {
		function absint( $number ) {
			return abs( (int) $number );
		}
	}

	if ( ! function_exists( 'wp_json_encode' ) ) {
		function wp_json_encode( $data, $options = 0, $depth = 512 ) {
			return json_encode( $data, $options, $depth );
		}
	}

	if ( ! function_exists( 'wp_generate_password' ) ) {
		function wp_generate_password( $length = 12, $special_chars = true, $extra_special_chars = false ) {
			unset( $special_chars, $extra_special_chars );
			return substr( bin2hex( random_bytes( (int) ceil( $length / 2 ) ) ), 0, (int) $length );
		}
	}

	if ( ! function_exists( 'wp_get_attachment_image_url' ) ) {
		function wp_get_attachment_image_url( $attachment_id, $size = 'thumbnail' ) {
			unset( $size );
			$attachment_id = absint( $attachment_id );
			if ( ! $attachment_id ) {
				return false;
			}
			return 'http://example.test/wp-content/uploads/image-' . $attachment_id . '.jpg';
		}
	}

	if ( ! function_exists( '__' ) ) {
		function __( $text, $domain = 'default' ) {
			unset( $domain );
			return $text;
		}
	}

	if ( ! function_exists( '_x' ) ) {
		function _x( $text, $context, $domain = 'default' ) {
			unset( $context, $domain );
			return $text;
		}
	}

	if ( ! function_exists( 'esc_html__' ) ) {
		function esc_html__( $text, $domain = 'default' ) {
			return esc_html( __( $text, $domain ) );
		}
	}

	if ( ! function_exists( 'add_action' ) ) {
		function add_action( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
			unset( $hook, $callback, $priority, $accepted_args );
			return true;
		}
	}

	if ( ! function_exists( 'add_filter' ) ) {
		function add_filter( $hook, $callback, $priority = 10, $accepted_args = 1 ) {
			unset( $hook, $callback, $priority, $accepted_args );
			return true;
		}
	}

	if ( ! function_exists( 'apply_filters' ) ) {
		function apply_filters( $hook, $value ) {
			unset( $hook );
			return $value;
		}
	}

	if ( ! function_exists( 'do_action' ) ) {
		function do_action( $hook ) {
			unset( $hook );
		}
	}

	if ( ! function_exists( 'get_option' ) ) {
		function get_option( $option, $default = false ) {
			global $smm_test_options;
			if ( isset( $smm_test_options[ $option ] ) ) {
				return $smm_test_options[ $option ];
			}
			return $default;
		}
	}

	if ( ! function_exists( 'update_option' ) ) {
		function update_option( $option, $value, $autoload = null ) {
			global $smm_test_options;
			unset( $autoload );
			$smm_test_options[ $option ] = $value;
			return true;
		}
	}

	if ( ! function_exists( 'current_user_can' ) ) {
		function current_user_can( $capability ) {
			global $smm_test_user_caps;
			if ( ! is_array( $smm_test_user_caps ) ) {
				return false;
			}
			return ! empty( $smm_test_user_caps[ $capability ] );
		}
	}

	if ( ! function_exists( 'get_role' ) ) {
		function get_role( $role ) {
			global $smm_test_roles;
			if ( isset( $smm_test_roles[ $role ] ) ) {
				return $smm_test_roles[ $role ];
			}
			return null;
		}
	}

	if ( ! function_exists( 'get_post' ) ) {
		function get_post( $post = null ) {
			global $smm_test_posts;
			$id = is_object( $post ) ? (int) $post->ID : absint( $post );
			return isset( $smm_test_posts[ $id ] ) ? $smm_test_posts[ $id ] : null;
		}
	}

	if ( ! function_exists( 'get_post_meta' ) ) {
		function get_post_meta( $post_id, $key = '', $single = false ) {
			global $smm_test_post_meta;
			$post_id = absint( $post_id );
			if ( ! isset( $smm_test_post_meta[ $post_id ] ) ) {
				return $single ? '' : array();
			}
			if ( '' === $key ) {
				return $smm_test_post_meta[ $post_id ];
			}
			if ( ! isset( $smm_test_post_meta[ $post_id ][ $key ] ) ) {
				return $single ? '' : array();
			}
			$value = $smm_test_post_meta[ $post_id ][ $key ];
			return $single ? $value : array( $value );
		}
	}

	if ( ! function_exists( 'get_block_wrapper_attributes' ) ) {
		function get_block_wrapper_attributes( $extra_attributes = array() ) {
			$parts = array();
			foreach ( $extra_attributes as $key => $value ) {
				$parts[] = sprintf( '%s="%s"', esc_attr( $key ), esc_attr( $value ) );
			}
			return implode( ' ', $parts );
		}
	}

	if ( ! function_exists( 'wp_interactivity_data_wp_context' ) ) {
		function wp_interactivity_data_wp_context( $context ) {
			return 'data-wp-context="' . esc_attr( wp_json_encode( $context ) ) . '"';
		}
	}

	if ( ! class_exists( 'WP_Error', false ) ) {
		class WP_Error {
			public $errors = array();
			public $error_data = array();

			public function __construct( $code = '', $message = '', $data = '' ) {
				if ( '' !== $code ) {
					$this->errors[ $code ][] = $message;
					if ( '' !== $data ) {
						$this->error_data[ $code ] = $data;
					}
				}
			}

			public function get_error_code() {
				$codes = array_keys( $this->errors );
				return $codes ? $codes[0] : '';
			}
		}
	}

	if ( ! class_exists( 'WP_REST_Server', false ) ) {
		class WP_REST_Server {
			const READABLE = 'GET';
			const EDITABLE = 'POST, PUT, PATCH';
			const CREATABLE = 'POST';
			const DELETABLE = 'DELETE';
			const ALLMETHODS = 'GET, POST, PUT, PATCH, DELETE';
		}
	}

	if ( ! function_exists( 'register_post_type' ) ) {
		function register_post_type( $post_type, $args = array() ) {
			unset( $post_type, $args );
			return true;
		}
	}

	if ( ! function_exists( 'register_post_meta' ) ) {
		function register_post_meta( $post_type, $meta_key, $args ) {
			unset( $post_type, $meta_key, $args );
			return true;
		}
	}

	if ( ! function_exists( 'register_block_type' ) ) {
		function register_block_type( $block_type, $args = array() ) {
			unset( $block_type, $args );
			return true;
		}
	}

	if ( ! function_exists( 'register_rest_route' ) ) {
		function register_rest_route( $namespace, $route, $args = array(), $override = false ) {
			unset( $namespace, $route, $args, $override );
			return true;
		}
	}

	if ( ! function_exists( 'rest_ensure_response' ) ) {
		function rest_ensure_response( $response ) {
			return $response;
		}
	}

	if ( ! function_exists( 'plugin_dir_path' ) ) {
		function plugin_dir_path( $file ) {
			return trailingslashit( dirname( $file ) );
		}
	}

	if ( ! function_exists( 'plugin_dir_url' ) ) {
		function plugin_dir_url( $file ) {
			unset( $file );
			return 'http://example.test/wp-content/plugins/structured-mega-menu/';
		}
	}

	if ( ! function_exists( 'plugin_basename' ) ) {
		function plugin_basename( $file ) {
			return basename( dirname( $file ) ) . '/' . basename( $file );
		}
	}

	/**
	 * Simple role stub for capability tests.
	 */
	class SMM_Test_Role {
		public $name;
		public $capabilities = array();

		public function __construct( $name, array $capabilities = array() ) {
			$this->name         = $name;
			$this->capabilities = $capabilities;
		}

		public function has_cap( $cap ) {
			return ! empty( $this->capabilities[ $cap ] );
		}

		public function add_cap( $cap ) {
			$this->capabilities[ $cap ] = true;
		}

		public function remove_cap( $cap ) {
			unset( $this->capabilities[ $cap ] );
		}
	}
}
