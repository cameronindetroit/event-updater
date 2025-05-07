import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'

const EventUpdater = (props) => {
  const { color, text,saveToDatabase, externalEvents,externalEventsPage2,externalEventsPage3, internalEvents,dateRangeParameters, noDataAvailable,noNewEvents,newEventsAdded,updateEvents,addingEvents,updatesAdded,deleteEvents,eventsDeleted} = props
  const [delayActive, setDelayActive] = useState(false);
  const [fetchedData, setFetchedData] = useState(false);
  const [processedEventIDs, setProcessedEventIDs] = useState(new Set());
	let newEvents = [];
  let deletedEvents = [];
  let updatedEvents = []; // Array to hold events that need updating
  let matchingInternalEventID;
  let totalEvents = [];

  // Add a 180 second delay to handle Event change again
  // const retriggerHandleEventsChange = () => {
  //   // Set delayActive to true to indicate delay is in progress
  //   console.log('delay active')
  //   setDelayActive(true);
  //   setTimeout(() => {
  //     // Call handleEventsChange after 180 seconds
  //     setDelayActive(false);
  //     console.log('timerdeactivated')
  //     handleEventsChange();
  //     // Reset the delayActive state
  //   }, 180000); // 180 seconds in milliseconds
  // };

  const handleEventsChange = async () => {
    try {
      if (!externalEvents.length ||  externalEventsPage2 === "unidentified" || await externalEventsPage3 === "unidentified"){ 
        console.log("data not available at this time, please try again");
        await noDataAvailable();
      } else {
        totalEvents = await externalEvents.concat(await externalEventsPage2, await externalEventsPage3)
      }

// Iterate over externalEvents  
if(totalEvents.length > 0){
  console.log(totalEvents)
 for (const totalEvent of totalEvents) {
  const matchingEvent = internalEvents.find(internalEvent => internalEvent?._meta?.record?.c_c4btcduxu81kdh8zovh7bu593 === totalEvent.id);
  if (!matchingEvent && !(totalEvent?._meta?.record?.schedule?.scheduled_start > dateRangeParameters) && totalEvent?._meta?.record?.work_status === "scheduled") {
    const eventId = totalEvent.id;
    if (!processedEventIDs.has(eventId)) {
      newEvents.push(totalEvent);
      setProcessedEventIDs(prev => new Set(prev).add(eventId));
    }
  } 

  if (matchingEvent && totalEvent?._meta?.record?.work_status === "pro canceled" || totalEvent?._meta?.record?.work_status === "user canceled") {
    if(matchingEvent !== undefined){
    deletedEvents.push(matchingEvent);
    }
  }
  //If matching events are found 
  if (matchingEvent){
     const internalEventID = await matchingEvent?.id;
     let internalEventName = await matchingEvent?._meta?.record?.c_a3mj3nuuvzkuihmdmogsqgmdc;
     let externalEventName = await totalEvent?._meta?.record?.customer?.company;
     let externalEventStartDate = new Date(totalEvent?._meta?.record?.schedule?.scheduled_start);
     let externalEventEndDate = new Date(totalEvent?._meta?.record?.schedule?.scheduled_end);
     let internalEventStartDate = new Date(matchingEvent?._meta?.record?.c_f5g01wskgydup2cfqe4ijecwj);
     let totalHours = (externalEventEndDate.getTime() - externalEventStartDate.getTime()) / (1000 * 60 * 60);
     let productionScore = setProductionScore(totalHours,totalEvent);
     let firstName = await totalEvent?._meta?.record?.customer?.first_name;
     let lastName = await totalEvent?._meta?.record?.customer?.last_name;
     let companyName = await totalEvent?._meta?.record?.customer?.company ? totalEvent?._meta?.record?.customer?.company : firstName + " " +  lastName;
     let internalStreet = await matchingEvent?._meta?.record?.c_3239gqznigqogg2v1vdaw2z5e;
     let externalStreet = await totalEvent?._meta?.record?.address?.street ? totalEvent?._meta?.record?.address?.street : internalStreet;
     let internalCity = await matchingEvent?._meta?.record?.c_ckc2zblu2cf8okihg9wvuqec7;
     let externalCity = await totalEvent?._meta?.record?.address?.city ? totalEvent?._meta?.record?.address?.city : internalCity ;
     let internalState = await matchingEvent?._meta?.record?.c_ewljpj3szmo2vs1i89d2uwt6h;
     let externalState = await totalEvent?._meta?.record?.address?.state ? totalEvent?._meta?.record?.address?.state : internalState ;
     let internalEventZip =  Number(matchingEvent?._meta?.record?.c_7k4daugfow396odx12eolfj1a);
     let externalEventZip =  Number(totalEvent?._meta?.record?.address?.zip) ? Number(totalEvent?._meta?.record?.address?.zip) : internalEventZip;

     //Add logic to include the different section sof notes
     let internalNotes = await matchingEvent?._meta?.record?.c_4h9hs7ynuv9m8zt6hay7zipnh;
     let externalNotes = await totalEvent?._meta?.record?.customer?.notes ? totalEvent?._meta?.record?.customer?.notes : internalNotes;

     //fix why home contact not updating
     let internalHomeContact = await matchingEvent?._meta?.record?.c_dqaq9ooedfcrilwwyvwdfgl3y;
     let externalHomeContact = await totalEvent?._meta?.record?.customer?.home_number ? totalEvent?._meta?.record?.customer?.home_number : internalHomeContact;
     let internalMobileContact = await matchingEvent?._meta?.record?.c_7ix6qgep464w49st13kjosncv;
     let externalMobileContact = await totalEvent?._meta?.record?.customer?.mobile_number ? totalEvent?._meta?.record?.customer?.mobile_number : internalMobileContact;
     let eventPrice = await totalEvent?._meta?.record?.total_amount;

     if (
       internalEventStartDate.getTime() !== externalEventStartDate.getTime() 
       || companyName !== internalEventName 
       || internalStreet !== externalStreet 
       || internalCity !== externalCity 
       || internalState !== externalState 
       || internalEventZip !== externalEventZip
      //  || internalNotes !== externalNotes 
       || internalHomeContact !== externalHomeContact
       || internalMobileContact !== externalMobileContact
       ){
        matchingInternalEventID = await matchingEvent?.id;
        let fsmProductionMetric = await totalEvent?._meta?.record?.description;
        let fsmCustomerID = await totalEvent?._meta?.record?.customer.id;
        let fsmClientID = await totalEvent?.id
        let updatedInternalEventStartDate = await totalEvent?._meta?.record?.schedule?.scheduled_start;
        let updatedInternalEventEndDate = await totalEvent?._meta?.record?.schedule?.scheduled_end;
        updatedEvents.push(totalEvent)
        updateEventDateInDatabase(
          matchingInternalEventID,
          updatedInternalEventStartDate,
          updatedInternalEventEndDate,
          companyName,
          fsmProductionMetric,
          fsmCustomerID,
          fsmClientID,
          externalStreet,
          externalCity,
          externalState,
          externalEventZip,
          externalNotes,
          externalHomeContact,
          externalMobileContact,
          eventPrice,
          productionScore);
    }
  }
}

if (updatedEvents.length > 0){

// New: Prepare a string to hold concatenated event names and dates
let concatenatedEventDetails = updatedEvents.map(event => {
  const eventName = event?._meta?.record?.customer?.company ?? 
                    `${event?._meta?.record?.customer?.first_name} ${event?._meta?.record?.customer?.last_name}`;
  const eventDate = new Date(event?._meta?.record?.schedule?.scheduled_start).toLocaleDateString();
  return `${eventName}, ${eventDate}`;
}).join('; '); // Use ; to separate individual event strings, or use any other separator

  console.log(updatedEvents.length);
  console.log(updatedEvents)
 await updatesAdded(updatedEvents.length, concatenatedEventDetails)
} 

if (newEvents.length > 0){
  await setNewEvents(newEvents); 
}

if (deletedEvents.length > 0){
 // Prepare a string that holds concatenated event names and dates for deleted events
 let deletedEventDetails = deletedEvents.map(deletedEvent => {
  const eventName = deletedEvent?._meta?.record?.c_a3mj3nuuvzkuihmdmogsqgmdc;
  const eventDate = new Date(deletedEvent?._meta?.record?.c_f5g01wskgydup2cfqe4ijecwj).toLocaleDateString();
  return `${eventName}, ${eventDate}`;
}).join('; '); // Use ; to separate individual event strings, or use any other separator
  for (const deletedEvent of deletedEvents) {
      // console.log(deletedEvent)
    let eventID = deletedEvent.id
    deleteEvents(
      eventID
    )
  }
  console.log(deletedEventDetails)
  eventsDeleted(
    deletedEvents.length,
    deletedEventDetails
  )
}

if(newEvents.length === 0 && updatedEvents.length === 0 && deletedEvents.length === 0){
  //Action to call modal for this scenario 
  await noNewEvents();
} 

totalEvents =[];
updatedEvents=[]
deletedEvents=[]
newEvents=[]
}
    } catch (error){
      console.error("Failed to handle event changes:", error);
    }

    // if (!delayActive && externalEvents.length > 0) {
    //   retriggerHandleEventsChange();
    // }
}


//function to update data in database 
const updateEventDateInDatabase = async (ID,startDate,endDate,companyName,fsmProductionMetric,fsmCustomerID,fsmClientID,street,city,state,zip,notes,homeContact,mobileContact,eventPrice,productionScore) => {
  try {
    await updateEvents(
      ID,
      startDate,
      endDate,
      companyName,
      fsmProductionMetric,
      fsmCustomerID,
      fsmClientID,
      street,
      city,
      state,
      zip,
      notes,
      homeContact,
      mobileContact,
      eventPrice,
      productionScore 
    )
    // console.log("data sent todatabase")
    } catch (error) {
      console.error("Failed to update event date in database:", error);
    }
}

 //function to export data to database
 const setNewEvents = async (newEvents) =>{
   try {
    addingEvents();
	for(let i= 0; i < newEvents.length; i++){
const start = new Date(newEvents[i]?._meta?.record?.schedule?.scheduled_start).getTime(); 
const end = new Date(newEvents[i]?._meta?.record?.schedule?.scheduled_end).getTime(); 
const totalHours = (end - start) / (1000 * 60 * 60);
const productionScore = setProductionScore(totalHours,newEvents[i]);
let startTime = newEvents[i]?._meta?.record?.schedule?.scheduled_start;
let endTime = newEvents[i]?._meta?.record?.schedule?.scheduled_end;
let firstName = newEvents[i]?._meta?.record?.customer?.first_name;
let lastName = newEvents[i]?._meta?.record?.customer?.last_name;
let companyName = newEvents[i]?._meta?.record?.customer?.company ? newEvents[i]?._meta?.record?.customer?.company : firstName + " " +  lastName;
let mobileNumber = newEvents[i]?._meta?.record?.customer?.mobile_number;
let homeNumber = newEvents[i]?._meta?.record?.customer?.home_number;
let city = newEvents[i]?._meta?.record?.address?.city;
let state = newEvents[i]?._meta?.record?.address?.state;
let street = newEvents[i]?._meta?.record?.address?.street;
let zip = newEvents[i]?._meta?.record?.address?.zip;
//get notes directly from the notes array
let notesArray = newEvents[i]?._meta?.record?.notes;
let combinedNotes = '';
if (notesArray && notesArray.length > 1) {
  // Map through each note object to extract the 'text' property, then join all texts with a space
  combinedNotes = notesArray.map(note => note.content).join('. ');
}
let notes = newEvents[i]?._meta?.record?.customer?.notes;
let description = newEvents[i]?._meta?.record?.description;
let totalAmount = newEvents[i]?._meta?.record?.total_amount;
totalAmount = Math.floor(totalAmount/100);
let eventId = newEvents[i]?.id;
let employeeId = newEvents[i]?._meta?.record?.assigned_employees?.[0]?.id;
let customerId =  newEvents[i]?._meta?.record?.customer.id;
	await	saveToDatabase(
      startTime,
      endTime,
      companyName,
      eventId,
      firstName,
      lastName,
      mobileNumber,
      homeNumber,
      city,
      state,
      street,
      zip,
      notes,
      description,
      totalAmount,
      employeeId,
      customerId,
      totalHours,
      productionScore,
      combinedNotes
      )
	}
	// console.log(newEvents)
  //modal in adalo that new events were added success
  newEventsAdded(newEvents.length);
   } catch (error){
    console.error("Failed to set new events:", error);
   }
}
//function to calculate the production score
const setProductionScore = (totalHours,newEvents) => {
  let productionScore = totalHours * 10;  // Default to 0
    return productionScore;  
}

// useEffect(() => {
//   if(!fetchedData){
//   if(!Array.isArray(externalEvents) || !externalEvents.length && !fetchedData) {
//     // console.log('no events on firstpage')
//     setFetchedData(false)
//     // console.log(fetchedData)
//   } else if( Array(externalEvents).length > 0 && !fetchedData) {
//     // console.log(externalEvents)
//     handleEventsChange()
//     setFetchedData(true)
//   } else if (fetchedData){
//       // console.log('data Updated')
//   }
// }
// }, [externalEvents]);

  return (
    <View style={styles.wrapper}>
      <Button 
      title={text} 
      color={color}
      onPress={handleEventsChange}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default EventUpdater