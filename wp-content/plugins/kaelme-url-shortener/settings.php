<?php
//function definition
function km_shorturl_msg( $msg, $fail = false ){
	if( $fail ) header('HTTP/1.0 500 Internal Server Error');
?>
<div class="updated fade" id="message" style="background-color: rgb(255, 251, 204);">
<p>
<?php echo $msg; ?>
</p>
</div>
<?php
}

function km_shorturl_css(){
?>
<style type="text/css">
.km-desc{font-weight:normal; color:#333;}
.km-btn{display:inline;}
.km-comfirm{margin-bottom:0.5em;}
table#km-settings tr th{padding-top:5px;}
.km-hr{border-top:none; border-left:none; border-right:none; border-bottom:1px soli #ccc; margin-bottom:0;}
.km-wide-td{width:106px;}
.km-url-th{width:350px;}
</style>
<?php
}

function km_shorturl_admin(){
	add_submenu_page('plugins.php', 'Configure Url Shortener', 'Url Shortener', 10, 'settings', 'km_shorturl_options');
}

function km_shorturl_options(){
	global $table_prefix, $wpdb, $user_ID;
	
	$table_name = $table_prefix . 'shortenurl';
	$km_settings = get_option('km_shorturl_set');
	
	if( !$km_settings ){
		$km_settings = array(0, '-', '~', 10, '', '', ''); //3 extra '' for further use;
		update_option('km_shorturl_set', $km_settings );
	}
	
	$km_rewrite_off = stripslashes( $km_settings[0] );
	$km_separator = stripslashes( $km_settings[1] );
	$km_post_sep = stripslashes( $km_settings[2] );
	
	if( !$km_rewrite_off ){
		$km_prefix = get_option('home') . '/' . $km_separator;
	}else{
		$km_prefix = get_option('home') . '/?' . $km_separator . '=';
	}
	
	if( $wpdb -> get_var( "show tables like '$table_name'" ) != $table_name ){
		$sql = "CREATE TABLE $table_name (
		request_url VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
		origin_url VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
		link_desc MEDIUMTEXT CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
		visit_count INT UNSIGNED NOT NULL DEFAULT '0',
		redirect_type SMALLINT UNSIGNED NOT NULL DEFAULT '307',
		PRIMARY KEY (`request_url`)
		);";
		
		require_once(ABSPATH . 'wp-admin/upgrade-functions.php');
		dbDelta($sql);
	}
	
	km_shorturl_css();
	
	
if( isset($_POST['action']) &&  $_SERVER['REQUEST_METHOD'] == 'POST'){
	$action = $_POST['action'];
	
	$request_url = $wpdb -> escape( $_POST['request_url'] );
	$origin_url = $wpdb -> escape( $_POST['origin_url'] );
	$link_desc = $wpdb -> escape( $_POST['link_desc'] );
	$redirect_type = $_POST['redirect_type'];

/* create new short url
---------------------------------------------------*/	
	if( $action == 'addnew' ){
		
		if( !isset( $_POST['comfirm'] ) ){
			$redirect = $wpdb -> get_row( "SELECT * FROM $table_name WHERE request_url = '$request_url'" );
			
			if( empty( $redirect ) ){
				$wpdb -> query( "INSERT INTO $table_name VALUES ( '$request_url', '$origin_url', '$link_desc', 0, $redirect_type )" );
				$msg =  'A new short url "' . $km_prefix . $request_url . '" has been created.';
			}else { 
?>
<div class="updated fade" id="message" style="background-color: rgb(255, 251, 204);">
<p>The short url "<?php echo $km_prefix . $request_url; ?>" already exists, do you want to overwrite it?</p>
<form method="post" class="km-comfirm">
	<input type="hidden" name="request_url" value="<?php echo $request_url; ?>" />
	<input type="hidden" name="origin_url" value="<?php echo $origin_url; ?>" />
	<input type="hidden" name="link_desc" value="<?php echo $link_desc; ?>" />
	<input type="hidden" name="redirect_type" value="<?php echo $redirect_type; ?>" />
	<input type="hidden" name="action" value="addnew" />
	<input type="submit" name="comfirm" value="Yes, please!" />
	<input type="submit" name="comfirm" value="No, cancel it." />
</form>
</div>			
<?php			}//end else;
		
		}elseif( $_POST['comfirm'] == 'Yes, please!' ){
			$wpdb -> query( "UPDATE $table_name SET origin_url='$origin_url', link_desc='$link_desc', redirect_type=$redirect_type WHERE request_url = '$request_url'" );
			$msg =  'The origin url for "' . $km_prefix . $request_url . '" has been updated.';
		}else{
			$msg =  'The change for "' . $km_prefix . $request_url . '" has been canceled.';
		}
	}
	
/* edit short url
---------------------------------------------------*/
	if( $action == 'edit' ){
		$edit_url = $request_url;
	}else $edit_url = false;
	
	if( $action == 'comfirm_edit' ){
		if( $_POST['comfirm_type'] == 'Update!' ){
			$wpdb -> query( "UPDATE $table_name SET origin_url='$origin_url', link_desc='$link_desc', redirect_type=$redirect_type WHERE request_url = '$request_url'" );
			$msg =  'The record for "' . $km_prefix . $request_url . '" has been updated.';
		}else{
			$msg =  'The change for "' . $km_prefix . $request_url . '" has been canceled.';
		}
	}

/* delete short url
---------------------------------------------------*/	
	if( $action == 'delete' ){
		if( !isset( $_POST['comfirm'] ) ){
?>
<div class="updated fade" id="message" style="background-color: rgb(255, 251, 204);">
<p>Do you really wanna delete the record for "<?php echo $km_prefix . $request_url; ?>" ?</p>
<form method="post" class="km-comfirm">
	<input type="hidden" name="request_url" value="<?php echo $request_url; ?>" />
	<input type="hidden" name="action" value="delete" />
	<input type="submit" name="comfirm" value="Yes, please!" />
	<input type="submit" name="comfirm" value="No, cancel it." />
</form>
</div>			
<?php
		}elseif( $_POST['comfirm'] == 'Yes, please!' ){
			$wpdb -> query( "DELETE FROM $table_name WHERE request_url = '$request_url'" );
			$msg =  'The short url "' . $km_prefix . $request_url . '" has been deleted.';
		}else{
			$msg =  'The delete progress for "' . $km_prefix . $request_url . '" has been canceled.';
		}
	}

/* change rewrite_module settings
---------------------------------------------------*/	
	if( $action == 'rewrite_settings' ){
		if( $_POST['rewrite_off'] ){
			$km_settings[0] = 1;
			$km_separator = 'u';
			$km_settings[1] = 'u';
		}else{
			$km_settings[0] = 0;
			$km_separator = '-';
			$km_settings[1] = '-';
		}

		update_option('km_shorturl_set', $km_settings );
		
		$msg = 'Your settings about rewrite_module has been updated.';
	}
	
	if( $action == 'change_settings' ){
		if( $_POST['separator'] ){
			$km_settings[1] = $_POST['separator'];
			$km_per_page = abs( ( int )$_POST['urls_per_page'] );
			$km_per_page = $km_per_page ? $km_per_page : 10;
			$km_settings[3] = $km_per_page;
		}
		update_option('km_shorturl_set', $km_settings );
		
		$msg = 'Your settings has been updated.';
	}
	


	if( isset( $msg ) ) km_shorturl_msg( $msg );

	
}//endif $_post['action']

	$km_rewrite_off = stripslashes( $km_settings[0] );
	$km_separator = stripslashes( $km_settings[1] );
	$km_post_sep = stripslashes( $km_settings[2] );
	$km_per_page = stripslashes( $km_settings[3] );
	
	if( !$km_rewrite_off ){
		$km_prefix = get_option('home') . '/' . $km_separator;
	}else{
		$km_prefix = get_option('home') . '/?' . $km_separator . '=';
	}

/* HTML for admin page
---------------------------------------------------*/
?>
<div class=wrap>
<h2>Kael<sup>.me</sup> Url Shortener</h2>
Kael<sup>.me</sup> Url Shortener let you create tiny urls like <code>http://yoursite/-abc</code>, and easily manage them.
<hr class="km-hr" />
Using <em>Kael<sup>.me</sup> Url Shortener</em> normally, <strong>url rewrite_module on your server must be activated.</strong><br/>
If not, don't worry, you can tick the checkbox "Oops, my rewrite_module is disabled!" below.
<form method="post">
<table class="form-table" id="km-settings">
<tr valign="top">
	<th scope="row">Don't Have Rewrite_module?</th>
	<td>
		<fieldset>
			<legend class="screen-reader-text"><span>Don't Have Rewrite?</span></legend>
			<label for="rewrite_off">
				<input type="checkbox" value="1" name="rewrite_off" id="rewrite-off" <?php if( $km_rewrite_off ) echo 'checked="true"'; ?>/>Oops, my rewrite_module is disabled!<br/>
				<span class="description">Tick this on, if rewrite_module of your server is disabled, or you use a default setting for <a href="<?php echo get_option('home');?>/wp-admin/options-permalink.php">Permalinks of your Wordpress</a> , <br/>that is, people always, and only can, use http://yoursite/?p=123 to visit your article. <br/><br/>Otherwise, have it unchecked.</span>
			</label>
		</fieldset>	
	</td>
</tr>
<tr valign="top">
	<td colspan="2">
		<input type="hidden" name="action" value="rewrite_settings" />
		<input type="submit" value="Save rewrite setting" />
	</td>
</tr>
</table>
</form>
<hr class="km-hr" />
			
<h2>Current Redirect Rules</h2>

<?php 
if ( isset( $_GET['apage'] ) )
   $page = abs( (int) $_GET['apage'] );
else
   $page = 1;

$start = $offset = ( $page - 1 ) * $km_per_page;


$all_links = $wpdb -> query( "SELECT * FROM $table_name" );

//prevent showing no links, especially when after deleting;
while( $start > $all_links - 1 ){
	$start -= $km_per_page;
	$offset -= $km_per_page;
	-- $page;
}

$link_data = $wpdb -> get_results( "SELECT * FROM $table_name LIMIT $offset, $km_per_page" );

$page_links = paginate_links( array(
   'base' => add_query_arg( 'apage', '%#%' ),
   'format' => '',
   'prev_text' => __('&laquo;'),
   'next_text' => __('&raquo;'),
   'total' => ceil($all_links / $km_per_page),
   'current' => $page
));

if ( $page_links ) : $links_navi = sprintf( '<span class="displaying-num">' . __( 'Displaying %s&#8211;%s of %s' ) . '</span>%s',
   number_format_i18n( $start + 1 ),
   number_format_i18n( min( $page * $km_per_page, $all_links ) ),
   number_format_i18n( $all_links ),
   $page_links
); 
?>

<div class="tablenav">
	<div class="tablenav-pages"><?php  echo $links_navi; ?></div>
</div>

<?php endif; ?>

<table class="widefat">

<thead>
	<tr>
	<th scope="col">Short URL</th>
	<th scope="col">Origin URL (Where it directs to)</th>
	<th scope="col">Description</th>
	<th scope="col">How Many Clicks</th>
	<th scope="col">Redirect Type</th>
	<th scope="col">Manage</th>
	</tr>
</thead>
<tbody id="the-list">

<?php
foreach ($link_data as $link) {

	if( !$edit_url || $link -> request_url != $request_url ){
?>

<tr>

<th scope="row"><?php echo $km_prefix . $link -> request_url; ?></th>
<th scope="row" class="km-url-th"><a href="<?php echo $link -> origin_url; ?>" target="_blank"><?php echo $link -> origin_url; ?></a></th>
<td><?php echo $link -> link_desc; ?></td>
<td><?php echo $link -> visit_count; ?></td>
<td><?php echo $link -> redirect_type; ?></td>
<td>
	<form method="post" name="delete" class="km-btn">
		<input type="hidden" name="action" value="delete" />
		<input type="hidden" name="request_url" value="<?php echo $link -> request_url; ?>" />
		<input type="submit" value="Delete" />
	</form>
	<form method="post" name="edit" class="km-btn">
		<input type="hidden" name="action" value="edit" />
		<input type="hidden" name="request_url" value="<?php echo $link -> request_url; ?>" />
		<input type="submit" value="Edit" />
	</form>
</td>

</tr>
<?php }else{ ?>
<tr>
<form method="post">
<td><?php echo $km_prefix . $request_url; ?></td>
<td><input name="origin_url" size="40" value="<?php echo $link -> origin_url; ?>" /></td>
<td><textarea name="link_desc" cols="35" rows="2" value="<?php echo $link -> link_desc; ?>" ></textarea></td>
<td><?php echo $link -> visit_count; ?></td>
<td>
	<select name="redirect_type">
	<option value ="307">Default</option>
	<option value ="307" <?php if( $link -> redirect_type == 307 ) echo 'selected="selected"'; ?>>307 Temporary Redirect</option>
	<option value="301" <?php if( $link -> redirect_type == 301 ) echo 'selected="selected"'; ?>>301 Permanently Redirect</option>
	</select>
</td>
<td class="km-wide-td">
	<input type="hidden" name="request_url" value="<?php echo $request_url; ?>" />
	<input type="hidden" name="action" value="comfirm_edit" />
	<input type="submit" name="comfirm_type" value="Update!" />
</td>
</form>
</tr>
<tr>
<form method="post">
<td colspan="6">
	<input type="hidden" name="request_url" value="<?php echo $request_url; ?>" />
	<input type="hidden" name="action" value="comfirm_edit" />
	<input type="submit" name="comfirm_type" value="Cancel edit, I don't wanna change anything." />
</form>
</td>
</tr>
<?php }
} //end foreach
?>

</tbody>
</table>

<?php
if ( $page_links ) : $links_navi = sprintf( '<span class="displaying-num">' . __( 'Displaying %s&#8211;%s of %s' ) . '</span>%s',
   number_format_i18n( $start + 1 ),
   number_format_i18n( min( $page * $km_per_page, $all_links ) ),
   number_format_i18n( $all_links ),
   $page_links
); 
?>

<div class="tablenav">
	<div class="tablenav-pages"><?php  echo $links_navi; ?></div>
</div>

<?php endif; ?>

<h2>Add New URL</h2>
<table class="widefat">
<thead>
	<tr>
	<th scope="col">Short URL<br/><span class="km-desc">20 characters max</span></th>
	<th scope="col">Origin URL<br/><span class="km-desc">225 characters max, don't forget "http(s)://"</span></th>
	<th scope="col">Description<br/><span class="km-desc">I'm lazy, so leave it blank</span></th>
	<th scope="col">Redirect Type<br/><span class="km-desc">remain "Default" if not sure</span></th>
	<th scope="col">Manage</th>
	</tr>
</thead>
<tbody>
<tr>
<form method="post" >
<td><?php echo $km_prefix; ?><input name="request_url" size="10" value="" /></td>
<td><input name="origin_url" size="40" value="" /></td>
<td><textarea name="link_desc" cols="35" rows="2" value="" ></textarea></td>
<td>
	<select name="redirect_type">
	<option value ="307">Default</option>
	<option value ="307">307 Temporary Redirect</option>
	<option value="301">301 Permanently Redirect</option>
	</select>
</td>
<td>
	<input type="hidden" name="action" value="addnew" />
	<input type="submit" value="OK, add this new URL" />
</td>
</form>
</tr>

</tbody>
</table>


<h2>Url Shortener Settings</h2>

<form method="post" autocomplete="off">
<table class="form-table" id="km-settings">

<?php if( !$km_rewrite_off ){ ?>
<tr valign="top">
	<th scope="row"><label for="separator">Separator</label></th>
	<td>
	<select id="separator" name="separator">
		<option value="-" <?php if( $km_separator == '-' ) echo 'selected="selected"'; ?>>dash: - </option>
		<option value="_" <?php if( $km_separator == '_' ) echo 'selected="selected"'; ?>>underscore: _ </option>
		<option value="+" <?php if( $km_separator == '+' ) echo 'selected="selected"'; ?>>plus: + </option>
		<option value="!" <?php if( $km_separator == '!' ) echo 'selected="selected"'; ?>>exclamation: !  </option>
	</select>
	<span class="description">Thus, the short url will be like "http://yoursite/-abc", if you choose '-'(dash symbol).</span>
	</td>
</tr>
<?php }else{ ?>

<tr valign="top">
	<th scope="row"><label for="separator">Separator</label></th>
	<td>
		<input type="text" size="5" value="<?php echo $km_separator; ?>" name="separator"/>
		<span class="description"><strong>Do NOT change if not sure.</strong><br/>
			The separator <strong>MUST BE</strong> a letter of the alphabet. <br/>
			Thus, the short url will be like "http://yoursite/?u=abc", if you use 'u' as the separator;</span>
	</td>
</tr>

<?php } ?>


<tr valign="top">
	<th scope="row"><label for="urls_per_page">Short urls per page</label></th>
	<td>
		<input type="text" size="3" value="<?php echo $km_per_page; ?>" name="urls_per_page"/>
		<span class="description">urls will be shown in one page.</span>
	</td>
</tr>

<tr valign="top">
	<td>
		<input type="hidden" name="action" value="change_settings" />
		<input type="submit" value="Save my changes" />
	</td>
</tr>
</table>

</form>

</div><!--end .wrap-->

<?php
}
?>