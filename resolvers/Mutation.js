module.exports = {
  postPhoto(parent, args) {
    let newPhoto = {
      id: _id++,
      ...args.input
    };
    photos.push(newPhoto);
    return newPhoto;
  }
};
