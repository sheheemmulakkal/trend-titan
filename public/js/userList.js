async function blockUser( userId ) {
    try {
      const response = await axios.patch(`/admin/block-user/${userId}`)
      if( response.data.success ){

        const button = document.getElementById(`block-${userId}`);
        const buttonContainer = document.getElementById(`button-container-${userId}`);
        button.classList.remove('badge-outline-success');
        button.classList.add( 'badge-outline-danger' );
        button.textContent = 'Unblock';
        button.removeEventListener('click', blockUser); // Remove the previous event listener
        button.addEventListener('click', () => unblockUser(userId)); // Add the new event listener
        buttonContainer.innerHTML = `<div><button id="unblock-${userId}" onclick="unblockUser('${userId}')" class="badge badge-outline-success">Unblock</button></div>`;
        showModal( 'success', 'User blocked' )
      } else {
        showModal( 'Error', 'Error in user blocking!!!' )
      }
      
    } catch(error) {
      console.log(error.message);
    }


  }

  async function unblockUser( userId ) {
    try {
      const response = await axios.patch(`/admin/unblock-user/${userId}`)
      if( response.data.success ){

        const button = document.getElementById(`unblock-${userId}`);
        const buttonContainer = document.getElementById(`button-container-${userId}`);
        button.classList.remove('badge-outline-danger');
        button.classList.add('badge-outline-success');
        button.textContent = 'Block';
        button.removeEventListener('click', unblockUser); // Remove the previous event listener
        button.addEventListener('click', () => blockUser(userId)); // Add the new event listener
        buttonContainer.innerHTML = `<div><button id="block-${userId}" onclick="blockUser('${userId}')" class="badge badge-outline-danger">Block</button></div>`;
        showModal( 'success', 'User unblocked' )

      } else {
        showModal( 'Error', 'Error in user unblocking!!!' )

      }
      
    } catch(error) {
      console.log(error.message);
    }


  }

  
    function showModal(title,message) {

      const modalTitle = document.getElementById('modalHead')
      const modalBody = document.getElementById('modalContent')

    modalTitle.innerText = title;
    modalBody.innerText = message;

  
    // Show the popup message modal
    $('#popupModal').modal('show');
    
    // Hide the popup message modal when clicking outside of it
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.modal-content').length) {
        $('#popupModal').modal('hide');
      }
    });

  }