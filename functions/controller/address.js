const { response } = require('express');
const admin = require('../firebaseInit');
const { logger } = require('firebase-functions');
const db = admin.firestore();

exports.postAddress = async (req,res) => {
    const {
        city,
        country,
        name,
        phone,
        pinCode,
        state,
        streetAddress
    } = req.body;

    const addressData = {
        userId : req.user.uid,
        country,
        state,
        city,
        streetAddress,
        pinCode,
        name,
        phone
    };

    try{
        const docRef = await db.collection('Address').add(addressData);
        res.status(201).send({message: "Address stored successfully.",bookingId:docRef.id});

        logger.log("info", {
            "message": "new address added",
            "addressId" : docRef.id
        });

    } catch(error) {
        console.error('Error storing Address:', error);
        res.status(500).send({status: 'Failed' , message: 'An error occured while storing the address'});
    }
};

exports.getAllAddresses = async (req,res) => {
    try{
        const userId = req.user.uid;
        const addresses = await db.collection('Address')
            .where('userId','==',userId)
            .get()
            .then(snapshot => snapshot.docs.map(doc => doc.data()));

        res.status(200).send({status:"Success",response:addresses});
        
    }catch(error){
        console.log("Error retreiving addresses: ",error);
        res.status(500).send({status:"Failed",error: error});
    }
}

exports.editAddress = async (req,res) => {
    try{
        const addressId = req.params.id;
        const updateAddressDetails = req.body;

        const addressRef = db.collection('Address').doc(addressId);
        let addressDetails = await addressRef.get();
        let responce = addressDetails.data();
        
        if(req.user.uid !== responce.userId){
            return res.status(403).send({status:'Failed',message:"Access to the requested resource is forbidden"});
        }
        
        await addressRef.update(updateAddressDetails);
        res.status(200).send({status:"Success",mssg:addressRef.id})
    }catch(error){
        console.error('Error updating address details:', error);
        res.status(500).json({ status: 'failed, An error occurred while updating address details.',error:error });
    }
};

exports.deleteAddress = async (req,res) => {
    try{

        const addressId = req.params.id;
        let reqDock = db.collection('Address').doc(addressId);
        let AddressDetails = await reqDock.get();
        let responce = AddressDetails.data();

        if(req.user.uid !== responce.userId){
            return res.status(403).send({status:'Failed',message:"Access to the requested resource is forbidden"});
        }

        await reqDock.delete();
        return res.status(200).send({status:"Success", message : "Address successfully deleted"});
    } catch(error) {
        console.log(error);
        res.status(500).send({status:"Failed",message : error});
    }
};