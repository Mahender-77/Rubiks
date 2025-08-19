import { X } from 'lucide-react-native';
import { Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Jobs } from '../../types/job';
import { useEffect, useState } from 'react';



type JobDetailsProps = {
  jobDetails: boolean; // you can replace `any` with a proper type later
  jobId: string | null;
  setJobDetails: (visible: boolean) => void;
};

export function JobDetails({
  jobDetails,
  jobId,
  setJobDetails,
}: JobDetailsProps) {
     const [jobData, setJobData] = useState<Jobs | null>(null);
       
    //  useEffect(()=>{
    //      const JoDetails = getJobDetails(jobId);
    //      console.log("erjfn")
    //      console.log('JobDetails:', JoDetails.then((data) => {
    //        if (data) {
    //          setJobData(data);
    //        } else {
    //          console.error('No job data found for ID:', jobId);
    //        }    
    //         }));
    //  })
   
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={jobDetails}
      onRequestClose={() => setJobDetails(false)} // Android back button
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Cancel Icon */}
          <TouchableOpacity
            onPress={() => setJobDetails(false)}
            style={styles.closeButton}
          >
            <X size={22} color="#333" />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Job Details</Text>
            <Text style={styles.text}>
              This is the job details content area.
            </Text>
            {jobId && <Text style={styles.text}>Job ID: {jobId}</Text>}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
  },
  modalContainer: {
    width: '80%',
    height: 250,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
