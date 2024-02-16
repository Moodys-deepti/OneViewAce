import {
  IExternalLinkCardAction,
  IQuickViewCardAction,
  BaseImageCardView, 
  IImageCardParameters, ICardButton
} from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'OneViewAceAdaptiveCardExtensionStrings';
import {
  IOneViewAceAdaptiveCardExtensionProps,
  IOneViewAceAdaptiveCardExtensionState,
 
} from '../OneViewAceAdaptiveCardExtension';

export class CardView extends BaseImageCardView<
  IOneViewAceAdaptiveCardExtensionProps,
  IOneViewAceAdaptiveCardExtensionState
  
> {
  public get data():IImageCardParameters{
    return{
        primaryText:`You have ${(this.state.approval === undefined || this.state.approval ==='0') ?  'no': this.state.approval} actions awaiting your attention and ${(this.state.requests === undefined || this.state.requests ==='0') ?  'no': this.state.requests} requests being tracked`,
        imageUrl:'https://growwwise.com/wp-content/uploads/2023/04/branding-agency-digitalmarketing-.jpg',
        title:'OneView'

    };

  }

  public get cardButtons():[ICardButton] | [ICardButton,ICardButton] | undefined{
    return [
      {
        title: strings.QuickViewButton,
        action: {
          type: 'ExternalLink',
          parameters: {
            target: 'https://oneview.moodys.com/'
          }
        }
      }  
    ];

  }

  

  public get onCardSelection(): IQuickViewCardAction | IExternalLinkCardAction | undefined {
    return {
      type: 'ExternalLink',
      parameters: {
        target: 'https://www.bing.com'
      }
    };
  }
}

