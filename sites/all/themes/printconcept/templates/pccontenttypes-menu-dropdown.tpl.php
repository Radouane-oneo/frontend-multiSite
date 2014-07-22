<div class="ideas">
  
  <!--  expert tips column -->
  
  <div class="first experttips">
    <h2 style="font-size:18px;"><?php print l(t('Expert tips'), 'experttips'); ?> </h2>
    <div class="image"><?php print ($expertTips->first ?  l(theme('image', array('path' => $expertTips->first->image)),'node/' . $expertTips->first->nid, array('html' => true))  : '') ; ?> </div>
    <h3><?php print l(t('Need some advice on designing impressive prints?'),'experttips'); ?></h3>
    <?php print drupal_render(node_title_list($expertTips->nodes)); ?> <?php print l(t('More expert tips'), 'experttips', array('attributes' => array('class' => array('more')))); ?> </div>
  
    <!--  news column -->
  <div class="news">
    <h2 style="font-size:18px"><?php print l(t('News'), 'news'); ?></h2>
    <div class="image"><?php print ($news->first ?  l(theme('image', array('path' => $news->first->image)), 'node/' . $news->first->nid, array('html' => true))  : '') ; ?> </div>
    <h3><?php print l(t('Read up on the latest PrintConcept.com news'),'news'); ?> </h3>
    <?php print drupal_render(node_title_list($news->nodes)); ?> <?php print l(t('More news'), 'news', array('attributes' => array('class' => array('more')))); ?> </div>
    
  
    <!--  blog column -->  
  <div class="last blog">
    <h2 style="font-size:18px"><?php print l(t('Blog'), 'blog'); ?></h2>
    <div class="image"><?php print ($blog->first ?  l(theme('image', array('path' => $blog->first->image)), 'node/' . $blog->first->nid, array('html' => true))  : '') ; ?></div>
    <h3><?php print l(t('Get around in the marketing and print world'),'blog'); ?></h3>
    <ul>
      <?php foreach($blog->nodes as $node):?>
      <li style="height:22px;"> <?php Print l($node->title, 'node/' . $node->nid); ?> </li>
      <?php endforeach;?>
    </ul>
    <?php print l(t('More blog'), 'blog', array('attributes' => array('class' => array('more')))); ?>

</div>
</div>
