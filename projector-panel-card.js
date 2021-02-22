class ProjectorPanelCard extends HTMLElement {
  set hass(hass) {
    const _this = this;
    const entities = this.config.entities;
    
    //Init the card
    if (!this.card) {
      const card = document.createElement('ha-card');
      
      if (this.config.title) {
          card.header = this.config.title;
      }
    
      this.card = card;
      this.appendChild(card);
    
      let allShutters = document.createElement('div');
      allShutters.className = 'sc-projector-panel';
      entities.forEach(function(entity) {
        let entityId = entity;
        if (entity && entity.entity) {
            entityId = entity.entity;
        }
        
        let buttonsPosition = 'left';
        if (entity && entity.buttons_position) {
            buttonsPosition = entity.buttons_position.toLowerCase();
        }
        
        let titlePosition = 'top';
        if (entity && entity.title_position) {
            titlePosition = entity.title_position.toLowerCase();
        }

        let invertPercentage = false;
        if (entity && entity.invert_percentage) {
          invertPercentage = entity.invert_percentage;
        }
          
        let shutter = document.createElement('div');

        shutter.className = 'sc-projector-panel';
        shutter.dataset.shutter = entityId;
        shutter.innerHTML = `
          <div class="sc-projector-panel-top" ` + (titlePosition == 'bottom' ? 'style="display:none;"' : '') + `>
            <div class="sc-projector-panel-label">
            
            </div>
            <div class="sc-projector-panel-position">
            
            </div>
          </div>
          <div class="sc-projector-panel-middle" style="flex-direction: ` + (buttonsPosition == 'right' ? 'row-reverse': 'row') + `;">
            <div class="sc-projector-panel-buttons">
              <ha-icon-button icon="mdi:arrow-up" class="sc-projector-panel-button" data-command="up"></ha-icon-button><br>
              <ha-icon-button icon="mdi:stop" class="sc-projector-panel-button" data-command="stop"></ha-icon-button><br>
              <ha-icon-button icon="mdi:arrow-down" class="sc-projector-panel-button" data-command="down"></ha-icon-button>
            </div>
            <div class="sc-projector-panel-selector">
              <div class="sc-projector-panel-selector-picture">
                <div class="sc-projector-panel-selector-slide"></div>
                <div class="sc-projector-panel-selector-picker"></div>
              </div>
            </div>
          </div>
          <div class="sc-projector-panel-bottom" ` + (titlePosition != 'bottom' ? 'style="display:none;"' : '') + `>
            <div class="sc-projector-panel-label">
            
            </div>
            <div class="sc-projector-panel-position">
            
            </div>
          </div>
        `;
        
        let picture = shutter.querySelector('.sc-projector-panel-selector-picture');
        let slide = shutter.querySelector('.sc-projector-panel-selector-slide');
        let picker = shutter.querySelector('.sc-projector-panel-selector-picker');
        
        let mouseDown = function(event) {
            if (event.cancelable) {
              //Disable default drag event
              event.preventDefault();
            }
            
            _this.isUpdating = true;
            
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('touchmove', mouseMove);
            document.addEventListener('pointermove', mouseMove);
      
            document.addEventListener('mouseup', mouseUp);
            document.addEventListener('touchend', mouseUp);
            document.addEventListener('pointerup', mouseUp);
        };
  
        let mouseMove = function(event) {
          let newPosition = event.pageY - _this.getPictureTop(picture);
          _this.setPickerPosition(newPosition, picker, slide);
        };
           
        let mouseUp = function(event) {
          _this.isUpdating = false;
            
          let newPosition = event.pageY - _this.getPictureTop(picture);
          
          if (newPosition < _this.minPosition)
            newPosition = _this.minPosition;
          
          if (newPosition > _this.maxPosition)
            newPosition = _this.maxPosition;
          
          let percentagePosition = (newPosition - _this.minPosition) * 100 / (_this.maxPosition - _this.minPosition);
          
          if (invertPercentage) {
            _this.updateShutterPosition(hass, entityId, percentagePosition);
          } else {
            _this.updateShutterPosition(hass, entityId, 100 - percentagePosition);
          }
          
          document.removeEventListener('mousemove', mouseMove);
          document.removeEventListener('touchmove', mouseMove);
          document.removeEventListener('pointermove', mouseMove);
      
          document.removeEventListener('mouseup', mouseUp);
          document.removeEventListener('touchend', mouseUp);
          document.removeEventListener('pointerup', mouseUp);
        };
      
        //Manage slider update
        picker.addEventListener('mousedown', mouseDown);
        picker.addEventListener('touchstart', mouseDown);
        picker.addEventListener('pointerdown', mouseDown);
        
        //Manage click on buttons
        shutter.querySelectorAll('.sc-projector-panel-button').forEach(function (button) {
            button.onclick = function () {
                const command = this.dataset.command;
                
                let service = '';
                
                switch (command) {
                  case 'up':
                      service = 'open_cover';
                      break;
                      
                  case 'down':
                      service = 'close_cover';
                      break;
                
                  case 'stop':
                      service = 'stop_cover';
                      break;
                }
                
                hass.callService('cover', service, {
                  entity_id: entityId
                });
            };
        });
      
        allShutters.appendChild(shutter);
      });
      
      
      const style = document.createElement('style');
      style.textContent = `
        .sc-projector-panel { padding: 16px; }
          .sc-projector-panel { margin-top: 1rem; overflow: hidden; }
          .sc-projector-panel:first-child { margin-top: 0; }
          .sc-projector-panel-middle { display: flex; width: 210px; margin: auto; }
            .sc-projector-panel-buttons { flex: 1; text-align: center; margin-top: 0.4rem; }
            .sc-projector-panel-selector { flex: 1; }
              .sc-projector-panel-selector-picture { position: relative; margin: auto; background-size: cover; min-height: 150px; max-height: 100%; width: 153px; }
                .sc-projector-panel-selector-picture { background-image: url(data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACXCAYAAAAGVvnKAAACnklEQVR42u3ZsW4jRRgH8JnZ2VjxuohkIeV0VCl5BKRUeQMq3oCWJ6Gk4VFSHRVKgZCAAglRRJGQgyxiCQfYsDvXxKcIiM7rbHIo/H6l5d1v59v/zuzY8erq6rMY41GMsS+lxBBCDDCOmFL6Jq9Wq49LKS9ilC3GVUoJdV2/zHt7e991XSdkPIqc8zI3TfPrJnUw2joZY7iduN7PpZS/Nh+WUoIZjfuWviHZ6Ps+hBBCSqlNKaWblNLd5I2VYAb27DH79tAaQ47LOYfLy8uwWCxCXde/5ZRSats2pJRCVVWjJP42wdLzyDfzv1qjlBKm02mo6zqUUn7OMcZS17UZ6H+w3D1lkKfTaUgphZTSnznG+EfOeau0P9bm4G6t+5rxtibdd22b725z7W877y51t6l9303fHDe0P9uOc0ivh977pmnenCJXVdVuO4vtOqgxArfLOYYE66G1hgbuoQEZKwy7jGlg6FO+vr6u+77/R8h2ffrGmM7HHPi2s8UYoX+Kh/BdPrxDa/V9H3LOJS+Xy2q5XI7y0j9GmHg+uq4Lh4eHv+f9/f3v7/6uMdZuZZulg+e/yWia5lWezWZfzmazNsa491y26Lx7t69gbdM0X+XJZPJDjPGX9Xr98t92mbCLm5ubcHBw8Cql9FOeTCbr8/PzT8/Ozj5frVbv1XXt/YlBK9PmL6dNXtq2DfP5/Ovj4+NPJpNJ92bturi4+OD09PSLxWLxYVVVd5e1dQhhKXD8XUoplVJehBCqTT66rgtHR0ffnpycfDSfz3/UJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACexmuWnhCpsC6c0AAAAABJRU5ErkJggg==); }
              .sc-projector-panel-selector-slide { position: absolute; top: 19px; left: 9px; width: 88%; height: 0; background-repeat: no-repeat; }
                .sc-projector-panel-selector-slide { background-image: url(data:image/png;base64,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); }
              .sc-projector-panel-selector-picker { position: absolute; top: 19px; left: 3px; width: 95%; cursor: pointer; height: 20px; background-repeat: no-repeat; }
                .sc-projector-panel-selector-picker { background-image: url(data:@file/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAAAHCAYAAAAF+d86AAABzElEQVRYw+1XW27bMBDckUjKsQ3UBnyN5ga5WI/ZT+cEhQHHDzHESiK3H5UDRaZeLoKmgfdHArkcrnaHsxS22+2PzWbzfTabLQAIEYHeW2zsvYPIm4+IUJIk7XVSPzGAexkbG8dQbJ9hnnp8puJ34Y3NmzTG0bMH6rKiVedmba/iAEBVVfn9fv+S5/mzYuZHZn4SkW+tzUcbAAKQhBASIqrobl/FEhFJW8SrAHTywHvvmfkXMz8o59yDc25RluUCQC1CgwpDN6jKFJwuvKmxyYBq0D9WLpq49hblogl1ecNvdqMIiTqVK4TgmfmVmefKGCPGGGitqdnaIvLZ1RKjPrim95gEo8d37NjY+SnxfNT81LW4IW9DGIi9R+pHAEhEqN0uW+QirXXQWosyxiDLMtFaU0O5/iYBQnf7Hw2Rq070et3FEQDw3lOWZUlRFFDH49GlaWq11ulUYgBIiSi9bFbLZTmRoHf7HMRSMbEQkQvRRETKIaAQgj+fz2dr7ava7XY/i6IQpdTiBnLBWkuHw4Hm8zmt1+vGz+MXyHh9cmPf0z7VY3w+yvryPRRDY+3Vleh0OpG1llarFS2XSwohSB8O/jDQ53n+4px7/g1+EAT732naegAAAABJRU5ErkJggg==); }
          .sc-projector-panel-top { text-align: center; margin-bottom: 1rem; }
          .sc-projector-panel-bottom { text-align: center; margin-top: 1rem; }
            .sc-projector-panel-label { display: inline-block; font-size: 20px; vertical-align: middle; }
            .sc-projector-panel-position { display: inline-block; vertical-align: middle; padding: 0 6px; margin-left: 1rem; border-radius: 2px; background-color: var(--secondary-background-color); }
      `;
    
      this.card.appendChild(allShutters);
      this.appendChild(style);
    }
    
    //Update the shutters UI
    entities.forEach(function(entity) {
      let entityId = entity;
      if (entity && entity.entity) {
        entityId = entity.entity;
      }

      let invertPercentage = false;
      if (entity && entity.invert_percentage) {
        invertPercentage = entity.invert_percentage;
      }
        
      const shutter = _this.card.querySelector('div[data-shutter="' + entityId +'"]');
      const slide = shutter.querySelector('.sc-projector-panel-selector-slide');
      const picker = shutter.querySelector('.sc-projector-panel-selector-picker');
        
      const state = hass.states[entityId];
      const friendlyName = (entity && entity.name) ? entity.name : state ? state.attributes.friendly_name : 'unknown';
      const currentPosition = state ? state.attributes.current_position : 'unknown';
      
      shutter.querySelectorAll('.sc-projector-panel-label').forEach(function(shutterLabel) {
          shutterLabel.innerHTML = friendlyName;
      })
      
      if (!_this.isUpdating) {
        shutter.querySelectorAll('.sc-projector-panel-position').forEach(function (shutterPosition) {
          shutterPosition.innerHTML = currentPosition + '%';
        })

        if (invertPercentage) {
          _this.setPickerPositionPercentage(currentPosition, picker, slide);
        } else {
          _this.setPickerPositionPercentage(100 - currentPosition, picker, slide);
        }
      }
    });
  }
  
  getPictureTop(picture) {
      let pictureBox = picture.getBoundingClientRect();
      let body = document.body;
      let docEl = document.documentElement;

      let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;

      let clientTop = docEl.clientTop || body.clientTop || 0;

      let pictureTop  = pictureBox.top + scrollTop - clientTop;
      
      return pictureTop;
  }
  
  setPickerPositionPercentage(position, picker, slide) {
    let realPosition = (this.maxPosition - this.minPosition) * position / 100 + this.minPosition;
  
    this.setPickerPosition(realPosition, picker, slide);
  }
  
  setPickerPosition(position, picker, slide) {
    if (position < this.minPosition)
      position = this.minPosition;
  
    if (position > this.maxPosition)
      position = this.maxPosition;
  
    picker.style.top = position + 'px';
    slide.style.height = position - this.minPosition + 'px';
  }
  
  updateShutterPosition(hass, entityId, position) {
    let shutterPosition = Math.round(position);
  
    hass.callService('cover', 'set_cover_position', {
      entity_id: entityId,
      position: shutterPosition
    });
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    
    this.config = config;
    this.maxPosition = 137;
    this.minPosition = 19;
    this.isUpdating = false;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return this.config.entities.length + 1;
  }
}

customElements.define("projector-panel-card", ProjectorPanelCard);