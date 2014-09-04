<?php if(!empty($fields['field_vignette_deal']->content)):?>	
    <div class="boxing">
        <div class="img"><?php print $fields['field_vignette_deal']->content; ?></div>

        <?php print $fields['body']->content; ?>
        
        <p id="prixdeal">
            <span class="newpricedeal"><?php print $fields['field_prix_deal']->content ?>€</span>
             au lieu de 
            <span class="pricedeal"><?php print $fields['field_prix_promotion']->content; ?>€</span>
        </p>
    </div>
    
    <div class="count-down">
        <?php
            $inactivebtn = "";
            if($fields['field_temps_deal_1']->content >= time()):
                
                    print $fields['field_temps_deal']->content;   
            
        ?>
           
         <?php else :?>
             
             <?php $inactivebtn = "inactivebtn"; ?>
            <div class="field-content">
                <div id="field-countdown-timer-0-96310000-1408967684" class="jquery-countdown-timer-processed countdownHolder">

                        <span class="countDays">
                            <span class="position">
                                <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                            </span>				
                            <span class="position">					
                                <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                            </span></span>
                                    <span class="countDiv countDiv0"></span><span class="countHours">
                                <span class="position">					
                                    <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                                </span>				
                                        <span class="position">				
                                    <span class="digit static" style="top: 0px; opacity: 1;">0</span>		
                                </span></span><span class="countDiv countDiv1"></span><span class="countMinutes">
                                    <span class="position">					
                                        <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                                    </span>				<span class="position">			
                                        <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                                    </span></span><span class="countDiv countDiv2"></span><span class="countSeconds"><span class="position">	
                                            <span class="digit static" style="top: 0px; opacity: 1;">0</span>	
                                        </span>		
                                        <span class="position">
                                            <span class="digit" style="top: 0.174072em; opacity: 0.930371;">0</span>			
                                        </span></span>
                </div>
                <div id="field-countdown-timer-note-0-96310000-1408967684" style="display:none;">0 jour, 21 heures, 4 minutes and 36 seconds left</div>

            </div>
        <?php endif; ?>
          <div class="cont_down_txt">
            <!-- img src="<?php //print base_path(); ?>sites/all/themes/printconnect/flyer/css/images/cont_down_txt.jpg" -->
                <span class="day">Jours</span>
                <span class="hours">Heures</span>
                <span class="min">Minutes</span>
                <span class="sec">Secondes</span>
            </div>
        
            
    </div>
    
        <?php if(!empty($fields['field_lien_deal']->content)):?>

            <a href="<?php if($inactivebtn=="") print urldecode($fields['field_lien_deal']->content); else print "javascript:void(0)" ?>" class="ui-button plusinfobtn <?php print $inactivebtn;?>" >
                <span class="flesh"></span>
                    J’en profite !
            </a>

        <?php endif; ?>
<?php endif; ?>	

<?php  print  $fields['contextual_links']->content ; ?>