const admin = require('../firebaseInit');
const db = admin.firestore();

exports.postBooking = async (req,res) => {
    try{

        const { 
            carId,
            pickupLocation,
            returnLocation,
            startDate,
            endDate,
            package
        } = req.body;

        const bookingData = {
            userId : req.user.uid,
            carId,
            startDate,
            endDate,
            pickupLocation,
            returnLocation,
            package
        };

        try {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);

            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                throw new Error('Invalid date format. Please use ISO 8601 (YYYY-MM-DDTHH:mm:ssZ).');
            }
            const timeDifference = Math.abs(endDateObj - startDateObj) / (1000 * 60 * 60); // Convert milliseconds to hours

            if (timeDifference < 1) {
                return res.status(400).json({ error: 'Booking duration must be at least 1 hour.' });
            }

        } catch (error) {
            return res.status(400).json({ error: 'Invalid date format. Please use ISO 8601.' });
        }
        const docRef = await db.collection('Booking').add(bookingData);
        res.status(201).send({message:"Booking stored successfully.",bookingId:docRef.id});

    }catch(error){

        console.error('Error storing booking:', error);
        res.status(500).json({ error: 'An error occurred while storing booking.' });

    }
};

exports.getAllBookings = async (req,res) => {
    
    try{
        const userId = req.user.uid;
        
        const booking  = await db.collection('Booking')
        .where('userId','==',userId)
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data()));
        
        res.status(200).send({status:"Success",responce:booking});

    }catch(error){

        console.log("Error retreiving booking: ",error);
        res.status(500).send({status:"Failed",error: error});
    }
};

exports.putEditDetails = async (req,res) => {
    try{
        const bookingId = req.params.id;
        const updateBookingDetails = req.body;

        const bookingRef = db.collection('Booking').doc(bookingId);
        let bookingDetails = await bookingRef.get();
        let responce = bookingDetails.data();
        
        if(req.user.uid !== responce.userId){
            return res.status(403).send({status:'Failed',message:"Access to the requested resource is forbidden"});
        }
        
        await bookingRef.update(updateBookingDetails);
        res.status(200).send({status:"Success",mssg:bookingRef.id})
    }catch(error){
        console.error('Error updating booking details:', error);
        res.status(500).json({ error: 'An error occurred while updating booking details.' });
    }
};

exports.getSingleBooking = async (req,res) => {
    try{
        const bookingId = req.params.id;
        let reqDoc = db.collection('Booking').doc(bookingId);
        let bookingDetails = await reqDoc.get();
        let responce = bookingDetails.data();

        if(req.user.uid !== responce.userId){
            return res.status(403).send({status:'Failed',message:"Access to the requested resource is forbidden"});
        }

        return res.status(200).send({status:'Success',Data:responce});
    } catch (error){
        console.log(error);
        return res.status(500).send({status:'Failed',message:error});
    }
}

exports.deleteSingleBooking = async (req,res) => {
    try{

        const bookingId = req.params.id;
        let reqDock = db.collection('Booking').doc(bookingId);
        let bookingDetails = await reqDock.get();
        let responce = bookingDetails.data();

        if(req.user.uid !== responce.userId){
            return res.status(403).send({status:'Failed kjbvdhubev',message:"Access to the requested resource is forbidden"});
        }

        await reqDock.delete();
        return res.status(200).send({status:"Success", message : "Booking successfully deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"Failed",message : error});
    }
}