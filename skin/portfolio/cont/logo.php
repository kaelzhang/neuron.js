<div id="logo" class="logo"><a class="logo-l" href="/" title="back to home">Kael.me portfolio home<span class="logo-r"></span></a><ul class="logo-c" id="logo-cate"><?php

$cats = trim( wp_list_categories('title_li=&current_category=1&show_count=1&echo=0&depth=1') );
echo preg_replace(array('/>\s+</', '/<\/a>\s+\((\d+)\)\s+/'), array('><', '<span>/\1</span></a>'), $cats);
unset($cats);

?></ul></div>