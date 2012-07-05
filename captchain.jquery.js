(function( $ ){
    //my first jquery plugin
    //super simple captcha
    //not tested at all yet and probably crap code
    //but its a start
      var starttime=new Date().getTime();
      $.fn.captchain = function(settings) {
        return this.each(function(){
             var config = {
                'exp': 'Please perform the following calculation to help stop spam.',
                'error': 'You failed the captcha test. Please reload the page to try again.',
                'linktext': 'Show captcha'
            };
            var okay='undecided';
            if (settings){$.extend(config, settings);}
            var parentform=$(this).closest('form');//thanks @ http://stackoverflow.com/questions/4196385/find-element-that-has-either-class-1-or-class-2
            var childinput=parentform.find('input:not(input[type=hidden]),textarea');
            childinput.bind({
                  click: function() {
                       if(okay=='undecided'){//don't set it any time but the first time... we need to compare this too.
                           var thistime=new Date().getTime();
                           if(thistime>=starttime+2000){
                               okay='yes';
                           }else{
                               okay='no';
                           }
                       }
                  },
                  select: function() {
                       if(okay=='undecided'){
                           var thistime=new Date().getTime();
                           if(thistime>=starttime+2000){
                               okay='yes';
                           }else{
                            okay='no';
                           }
                       }
                  }
            });
            //create our input
            var rand1=Math.floor((Math.random()*82764)+1);
            var rand2=Math.floor((Math.random()*1943802)+1);//we want really big random numbers, so its hard to compute
            var randsign=Math.floor((Math.random()*4)+1);
            switch(randsign){
                case 1:
                    var sign='+';
                    break;
                case 2:
                    var sign='-';
                    break;
                case 3:
                    var sign='/';
                    break;
                case 4:
                    var sign='*';
                    break;
            }
            var problem='<label class="captchain-exp">'+config.exp+'</label><span class="captchain-problem"><br/>'+rand2+' '+sign+' '+rand1+'</span>';
            var input='<br/><input type="text" class="captchain-content" name="captchain-content" value=""/>';
            var link='<a class="captchain-start" href="javascript:void(0);">'+config.linktext+'</a>';
            var error='<br/><span class="captchain-error">'+config.error+'</span>';
            $(this).html(link+error+'<div class="captchain-show">'+problem+input+'</div>');
            $("#"+this.id+' a.captchain-start').bind({
                  click: function() {
                       $("#"+this.id+' div.captchain-show').show();
                       $("#"+this.id+' a.captchain-start').hide();
                       var captchainstart=new Date().getTime();
                  }
            });
            $("#"+this.id+' .captchain-content').bind({
                  paste: function() {
                       if(okay=='undecided'){//if we still don't know, and they c&p or write as opposed to just setting it we know they're good
                           //the sortof confusing thing about this thing is that we actually don't give a shit if they're right
                           //as long as they don't set it from some code we're good.
                           okay='yes';
                       }
                  },
                  keypress: function() {
                       if(okay=='undecided'){
                           okay='yes';
                       }
                  }
            });
            $(parentform).bind({
                  submit: function() {
                       if((captchainstart+3000)<=new Date().getTime()){//we don't care if you're good up to this, this is it. 
                           //too bad for math geniuses.
                           okay='no';
                       }
                       if(okay=='no'||okay=='undecided'){
                           $(this+' span.captchain-error').text(config.error);
                           return false;
                       }
                  }
            });
    });

  };
})( jQuery );
$('#c').captchain();​