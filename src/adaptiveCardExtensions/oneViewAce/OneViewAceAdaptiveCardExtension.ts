import type { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { OneViewAcePropertyPane } from './OneViewAcePropertyPane';
import {
  fetchServiceNowDataAT,IjsonResponse,fetchEmployeeId,fetchServiceNowDetailsNew,
    
} from './sp.service';

export interface IOneViewAceAdaptiveCardExtensionProps {
  title: string;
}

export interface IOneViewAceAdaptiveCardExtensionState {
  approval: string;
  requests: string;
  sndetail:IjsonResponse,
}

export interface IQuickViewData {
  tickets:string;
  actionitem:string;
  sndetail:IjsonResponse,
    
  }
const CARD_VIEW_REGISTRY_ID: string = 'OneViewAce_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'OneViewAce_QUICK_VIEW';

export default class OneViewAceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IOneViewAceAdaptiveCardExtensionProps,
  IOneViewAceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: OneViewAcePropertyPane;

  public async onInit(): Promise<void> { 
    this.state = {
      approval: '',
      requests: '',
      sndetail: { 
        actionable_item:'',
        tickets:'',
        actionable_items_detail_idam:[],
        actionable_items_detail_SF:[],
        actionable_items_detail_coupa:[],
        actionable_items_detail_concur:[],
        actionable_item_detail_snow:[],
        tickets_detail:[],
        tickets_detail_snow:[],
        tickets_detail_idam:[],
        tickets_detail_SF:[],
        tickets_detail_coupa:[],
        tickets_detail_concur:[],
        trainings_detail:[]  
      },
      
      

    };

    // registers the card view to be shown in a dashboard
    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    // registers the quick view to open via QuickView action
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());
    try {
     
      // Fetch employee ID
      const employeeId = await fetchEmployeeId(this.context);
      // Now you can use the employeeId in your API call or wherever needed
      console.log('Employee ID:', employeeId);
      //if (employeeId !== null){
          const approvalData = await fetchServiceNowDataAT(this.context,employeeId);
          //const jsonResponse = await fetchServiceNowDetails(this.context);
          const UserItemDetail = await fetchServiceNowDetailsNew(this.context,employeeId)
          
          //console.log("Calling json response")
          //console.log("json response is- ",jsonResponse)
          console.log("json response from api action item detail",UserItemDetail)
        // Ensure that the returned data has the expected structure
        if (approvalData && approvalData.approvals !== undefined && approvalData.tickets !== undefined) {
          const { approvals, tickets } = approvalData;
          console.log("approval count- ",approvalData.approvals)
          console.log("ticket count- ",approvalData.tickets)
          
          // Update the state with the fetched data
          this.setState({
          approval: approvals.toString(), // Convert to string if needed
          requests: tickets.toString(),  

          sndetail: { 
            actionable_item:UserItemDetail.actionable_item,
            tickets:UserItemDetail.tickets,
            actionable_items_detail_idam:UserItemDetail.actionable_items_detail_idam,
            actionable_items_detail_SF:UserItemDetail.actionable_items_detail_SF,
            actionable_items_detail_coupa:UserItemDetail.actionable_items_detail_coupa,
            actionable_items_detail_concur:UserItemDetail.actionable_items_detail_concur,
            actionable_item_detail_snow:UserItemDetail.actionable_item_detail_snow,
            tickets_detail:[],
            tickets_detail_snow:UserItemDetail.tickets_detail_snow,
            tickets_detail_idam:UserItemDetail.tickets_detail_idam,
            tickets_detail_SF:UserItemDetail.tickets_detail_SF,
            tickets_detail_coupa:UserItemDetail.tickets_detail_coupa,
            tickets_detail_concur:UserItemDetail.tickets_detail_concur,
            trainings_detail:UserItemDetail.trainings_detail 
          }
            });
        } else {
          console.error('Invalid data structure:', UserItemDetail);
        }
  //}
  //else {
  //  console.error('Employee ID is null for email:', this.context.pageContext.user.email);
  //} 
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
  }
  return Promise.resolve();
}  
    
  

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'OneViewAce-property-pane'*/
      './OneViewAcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.OneViewAcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
}
