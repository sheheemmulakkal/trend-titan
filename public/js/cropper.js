function handleImageSelect(event) {
    const files = event.target.files;
    const selectedImagesContainer = document.getElementById('selectedImagesContainer');
    selectedImagesContainer.innerHTML = '';
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const image = document.createElement('img');
        image.src = e.target.result;
        image.classList.add('selected-image');
  
        // Assign a unique identifier to the image
        const imageId = 'image_' + i;
        image.setAttribute('id', imageId);
  
        image.addEventListener('click', function () {
          openImagePopup(e.target.result, imageId);
        });
  
        selectedImagesContainer.appendChild(image);
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  function openImagePopup(imageSrc, imageId) {
    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('image-popup-overlay');
  
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('image-popup-container');
  
    const popupImage = document.createElement('img');
    popupImage.classList.add('image-popup');
    popupImage.src = imageSrc;
    popupContainer.appendChild(popupImage);
  
    const cropButton = document.createElement('button');
    cropButton.textContent = 'Crop';
    cropButton.classList.add('crop-button');
    cropButton.addEventListener('click', function () {
      const cropper = new Cropper(popupImage, {
        aspectRatio: 0, // Allow free-form cropping
        crop: function (event) {
          const croppedCanvas = cropper.getCroppedCanvas();
          // Use the croppedCanvas for further processing or display
          console.log(croppedCanvas);
  
          // Set the data attribute to mark the image as cropped
          document.getElementById(imageId).dataset.cropped = 'true';
        },
      });
  
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.classList.add('save-button');
      saveButton.addEventListener('click', function () {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL('image/jpeg');
        // Use the croppedImage for further processing or upload
  
        // Replace the original image with the cropped image
        document.getElementById(imageId).src = croppedImage;
        // Set the data attribute to mark the image as cropped
        document.getElementById(imageId).dataset.cropped = 'true';
  
        // Remove the popup and overlay
        document.body.removeChild(popupOverlay);
      });
  
      popupContainer.appendChild(saveButton);
    });
  
    popupContainer.appendChild(cropButton);
  
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
  
    popupOverlay.addEventListener('click', function (event) {
      if (event.target === popupOverlay) {
        closeImagePopup(popupOverlay);
      }
    });
  }
  
  function closeImagePopup(popupOverlay) {
    document.body.removeChild(popupOverlay);
  }
  
  function cancelForm() {
    window.location.href = '/admin/banner';
  }
  
  const fileInput = document.getElementById('images');
  fileInput.addEventListener('change', handleImageSelect);
  