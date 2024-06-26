document.addEventListener('DOMContentLoaded', function() {

    window.addEventListener("orientationchange", function(event) {
        if (window.orientation === 90 || window.orientation === -90) {
          // Força a orientação de retrato
          document.body.style.transform = 'rotate(-90deg)';
        } else {
          document.body.style.transform = '';
        }
      });

});

