import { ISPFxAdaptiveCard, BaseAdaptiveCardQuickView } from '@microsoft/sp-adaptive-card-extension-base';
import {
  IOneViewAceAdaptiveCardExtensionProps,
  IOneViewAceAdaptiveCardExtensionState
} from '../OneViewAceAdaptiveCardExtension';

import { IjsonResponse } from '../sp.service';

export interface IQuickViewData extends IjsonResponse
{ sndetail:IjsonResponse; 
  
    
}
export class QuickView extends BaseAdaptiveCardQuickView<
  IOneViewAceAdaptiveCardExtensionProps,
  IOneViewAceAdaptiveCardExtensionState,
  IQuickViewData
> {
  public get data(): IQuickViewData {
    console.log("ticket item list- ",this.state.sndetail.actionable_item_detail_snow)
    console.log("action item no- ",this.state.sndetail.actionable_item )
    
    return {
               
      sndetail:this.state.sndetail,
      actionable_item:this.state.sndetail.actionable_item,
      tickets:this.state.sndetail.tickets,
      actionable_items_detail_idam:this.state.sndetail.actionable_items_detail_idam,
      actionable_items_detail_SF:this.state.sndetail.actionable_items_detail_SF,
      actionable_items_detail_coupa:this.state.sndetail.actionable_items_detail_coupa,
      actionable_items_detail_concur:this.state.sndetail.actionable_items_detail_concur,
      actionable_item_detail_snow:this.state.sndetail.actionable_item_detail_snow,
      tickets_detail:[],
      tickets_detail_snow:this.state.sndetail.tickets_detail_snow,
      tickets_detail_idam:this.state.sndetail.tickets_detail_idam,
      tickets_detail_SF:this.state.sndetail.tickets_detail_SF,
      tickets_detail_coupa:this.state.sndetail.tickets_detail_coupa,
      tickets_detail_concur:this.state.sndetail.tickets_detail_concur,
      trainings_detail:this.state.sndetail.trainings_detail  
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/QuickViewTemplate.json');
  }
}
