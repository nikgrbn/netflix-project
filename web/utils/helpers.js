const formatDocument = (doc) => {
    if (!doc) return null;
    
    // Insert 'id' field instead of '_id' and leave the rest of the fields as is 
    const formattedDoc = {
      id: doc._id.toString(),
      ...doc._doc, // Spread the rest of the document fields
    };
    delete formattedDoc._id; // Remove the original _id field
  
    return formattedDoc;
  };
  
  module.exports = { formatDocument };