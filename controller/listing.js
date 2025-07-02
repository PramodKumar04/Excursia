const Listing = require('../models/listing.js');

module.exports.index= async (req, res) => {
    const listings = await Listing.find({});
    if (!listings || listings.length === 0) {
        return res.status(404).send("No listings found");
    }
    res.render("listings/index.ejs",{listings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id}=req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }
    else{
        res.render("listings/show.ejs",{listing});
    }
    
};

module.exports.createListing = async (req, res) => {
        let url =req.file.path;
        let filename= req.file.filename;
        console.log(url,"..",filename);
        const {title,description,image,price,category,location,country} =req.body;
        const listing = new Listing({
                title,
                description,
                price,
                category,
                location,
                country,
                
        });
        listing.owner=req.user._id;
        listing.image= {url,filename};
        req.flash("success","New Listing Created!");
        await listing.save();
        res.redirect("/listings");
};

module.exports.showUpdated =async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing ,originalImage });

};

module.exports.updateListing =async (req, res) => {
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url =req.file.path;
        let filename= req.file.filename;
        listing.image= {url,filename};
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    req.flash("success","Listing Deleted!");
    res.redirect('/listings');
};

