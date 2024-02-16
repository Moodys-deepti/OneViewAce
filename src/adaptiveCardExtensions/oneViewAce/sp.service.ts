import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';



export interface IjsonResponse{
  actionable_item:string,
  tickets:string,
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
}

export interface Entry {
  number: string;
  short_description: string;
  type: string;
  plaform: string;
}

export interface Input {
  snow: {
      Incidents?: Entry[];
      Requests?: Entry[];
      Approvals?: Entry[];
      Problems?: Entry[];
      Changes?: Entry[];
      Certs?: Entry[];

  };
}



// Ensure that SPFx is initialized

export const fetchEmployeeId = async (spContext: AdaptiveCardExtensionContext): Promise<string> => {
  try {
    const client: MSGraphClientV3 = await spContext.msGraphClientFactory.getClient('3');

    // Get information about the current user from the Microsoft Graph
    const user: MicrosoftGraph.User = await client.api('https://graph.microsoft.com/beta/me').get();

    // Log the user information (you can remove this in production)
    //console.log(JSON.stringify(user));
    console.log('empID-',user.employeeId);

    // Return the employee ID
    return user.employeeId || '';
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
    return '';
  }
};


// Define the API endpoint URL
export const fetchServiceNowDataAT = async (spContext: AdaptiveCardExtensionContext, employeeId:string): Promise<any> => {
  const spHttpClient: HttpClient = spContext.httpClient;
  try {
    const apiUrl='https://oneview.moodys.com/api/ticket-counts/'+employeeId+'/'
    const response: HttpClientResponse = await spHttpClient.get(apiUrl, HttpClient.configurations.v1);
    // Check if the request was successful (status code 200)
    console.log("URL is-", apiUrl)
    let userid2 = spContext.pageContext.user
    //this.context.pageContext.user.email
    console.log("user is-",userid2)
    if (response.ok) {
      // Parse the JSON response
      const data = await response.json();
      console.log('Data:', data);
      console.log('Data: approvals: ', data.actionable_items);
      
      return {approvals:data.actionable_items,
               tickets:data.tickets }
    } else {
      // Handle errors
      console.error(`Error: ${response.statusText}`);
      return null;
    }
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
    return null;
  }
};

function extractsnowFields(input: Input): Entry[] {
  const entries: Entry[] = [];

      for (const type in input.snow) {
          if (input.snow[type as keyof Input['snow']]) {
              const typeEntries = input.snow[type as keyof Input['snow']]!;
              for (const entry of typeEntries) {
                  entries.push({
                      number: entry.number,
                      short_description: entry.short_description,
                      type: type,
                      plaform: 'SNOW'
                  });
              }
          }
      } 

  return entries;
};  





export const fetchServiceNowDetailsNew = async (spContext: AdaptiveCardExtensionContext, employeeId:string): Promise<any> => {
    const spHttpClient: HttpClient = spContext.httpClient;
    try {
      //const apiUrl1='https://oneview-qa.moodys.com/api/ticket-counts-ace/29001540/'
      const apiUrl1='https://oneview-qa.moodys.com/api/ticket-counts-ace/'+employeeId+'/'
      const response: HttpClientResponse = await spHttpClient.get(apiUrl1, HttpClient.configurations.v1);
      // Check if the request was successful (status code 200)
      if (response.ok) {
        // Parse the JSON response
        const data = await response.json();
        console.log('Data:', data);
        const snow_action_iems=extractsnowFields(data.actionable_items_detail)
        const snow_ticket_iems=extractsnowFields(data.tickets_detail)
        //const ticket_list: Entry[] = extractFields(input_data);
        //const ticket_list: Entry[]= extractBigFields(data)

        
        console.log("acionable_item_detail_snow----->",snow_action_iems)
        //for (let item in  data.actionable_items_detail
        return ({"actionable_item":data.actionable_items,
                  "tickets":data.tickets,
                  "actionable_items_detail_idam":data.actionable_items_detail.idam,
                  "actionable_items_detail_SF":data.actionable_items_detail.salsforce,
                  "actionable_items_detail_coupa":data.actionable_items_detail.coupa,
                  "actionable_items_detail_concur":data.actionable_items_detail.concur,
                  "actionable_item_detail_snow":snow_action_iems,
                  "tickets_detail":data.tickets_detail,
                  "tickets_detail_snow":snow_ticket_iems,
                  "tickets_detail_idam":data.tickets_detail.idam,
                  "tickets_detail_SF":data.tickets_detail.salsforce,
                  "tickets_detail_coupa":data.tickets_detail.coupa,
                  "tickets_detail_concur":data.tickets_detail.concur,
                  "trainings_detail":data.trainings_detail.mkp  
                });
      } else {
        // Handle errors
        console.error(`Error: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error:', error);
      return null;
    }  

};


