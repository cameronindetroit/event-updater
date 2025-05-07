import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, Button } from 'react-native'

const EventUpdater = (props) => {
  const { color, text,saveToDatabase, externalEvents, internalEvents, productionMetrics } = props
  //externalEventState variable to track if data has been received from the
  const [hasLogged, setHasLogged] = useState(false)
	//new events array
	const newEvents = [];
  //Make Async
  const handleEventsChange = async () => {
// Iterate over externalEvents
 //Use await   
 for (const externalEvent of externalEvents) {
  const eventExists = await internalEvents.some(internalEvent => internalEvent?._meta?.record?.c_c4btcduxu81kdh8zovh7bu593 === externalEvent.id);
  if (!eventExists) {
    newEvents.push(externalEvent);
  }
}
await setNewEvents(newEvents); // Assuming this involves async logic
};
// externalEvents.forEach((externalEvent) => {
//     // Check if the id of externalEvent exists in internalEvents
//     //Use await
//     const eventExists = internalEvents.some((internalEvent) => internalEvent?._meta?.record?.c_c4btcduxu81kdh8zovh7bu593
// 	=== externalEvent.id);
//     // If it does not exist, add to internalEvents
//     if (!eventExists) {
//       //Use await
//       newEvents.push(externalEvent);
//     }
//   });Vio
//   //Use await
// 	setNewEvents(newEvents)
  // }

//compare id in housecall pro with hscjobID

 //function to export data to database
 const setNewEvents = async (newEvents) =>{
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
// let notes =newEvents[i]?._meta?.record?.notes;
let notes =newEvents[i]?._meta?.record?.customer?.notes;
let description = newEvents[i]?._meta?.record?.description;
let totalAmount = newEvents[i]?._meta?.record?.total_amount;
totalAmount = Math.floor(totalAmount / 10);
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
      productionScore
      )
	}
	console.log(newEvents)
}

//function to calculate the production score
const setProductionScore = (totalHours,newEvents) => {
  // const fsmProductionMetric = newEvents?._meta?.record?.description; // Get the description directly from the passed event
  // const getMetricPlacement = getProductionMetric(fsmProductionMetric); // Pass description directly
  let productionScore = totalHours * 10;  // Default to 0
  
  // if (getMetricPlacement !== null){
  //   const primaryMetric = productionMetrics[getMetricPlacement]?._meta?.record?.c_b2elvac2dq1wdxi5vdunj16c4;
  //   const secondaryMetric = productionMetrics[getMetricPlacement]?._meta?.record?.c_317t6uwievj2owc5azd8pv1g9;
  //   const useSecondaryMetric =  productionMetrics[getMetricPlacement]?._meta?.record?.c_f4siv0yqpddnwv86vxqqwb3g6;

  //   if(!useSecondaryMetric){
  //     productionScore = (totalHours * primaryMetric) / 10;
  //   } else {
  //     productionScore = (totalHours * secondaryMetric) / 10;
  //   }
  // }
  
  return productionScore;
}

// Function to pair the primary Metric Based on the description from fsm API
// const getProductionMetric = (fsmProductionMetric) => { // Accept description as parameter
//   let productionMetricPlacement = null; // Initialize as null to default to no match found

//   for (let i = 0; i < productionMetrics.length; i++) {
//     if (productionMetrics[i]?._meta?.record?.c_4x1g9osem25u32wcmi0a4cxil === fsmProductionMetric) {
//       productionMetricPlacement = i; // Update the placement if a match is found
//       break; // Exit the loop immediately after finding a match
//     }
//   }

//   return productionMetricPlacement; // Return the found placement, or null if no match was found
// }


// useEffect(() => {
//   const timeoutEventsHandling = () => {
//     setTimeout(() => {
//       setHasLogged(false);
//       // handleEventsChange(); // Assume this is a function to handle the events
//     }, 180000); // Adjust the delay as needed
//   };

//   // Check if externalEvents is non-empty and has not been logged yet.
//   if(externalEvents !== undefined && externalEvents.length > 0 && !hasLogged) {
//     // Set hasLogged to true so it doesn't log again
//     // console.log('component run');
//     setHasLogged(true);
//     handleEventsChange();
//     timeoutEventsHandling();
//   } 
// }, [hasLogged]); // Run this effect when externalEvents changes


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