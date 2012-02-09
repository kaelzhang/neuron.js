<script type="text/plain" id="test-tpl">
<?php echo '<?js'; ?>

	var i = 0,
		len = it.length,
		list,
		cls,
		txt;
		
	for(; i < len; i ++){
		list = it[i];
		cls = list.cls;
		txt = list.txt;
	
		<?php echo '?>'; 
		?><div class="@{cls}">@{txt}</div><?php echo '<?js'; ?>
	
	}
<?php echo '?>'; ?>
</script>

<script>

KM.provide('mvc/tpl', function(K, tpl){
	var data = [
		{cls:'class1', txt:'text1'},
		{cls:'class2', txt:'text2'},
		{cls:'class3', txt:'text3'}
	],
	
		t = $('#test-tpl').html(),
		
		parsed = tpl.parse(t);
		
	console.log(parsed, parsed(data) );
});


</script>