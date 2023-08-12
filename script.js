document.addEventListener("DOMContentLoaded", function () {
    var redeemBtn = document.getElementById('redeemBtn');
    var message = document.getElementById('message');
    var prizeDisplay = document.getElementById('prize');

    var gistUrl = "https://api.github.com/gists/28a930d11c713dc8d2a69afd9fbf1446"; // Replace with your Gist URL

    var validCodes = {
        "1221": "20 Robux",
        "12345": "Surprise 2"
        // Add more codes and prizes as needed
    };

    redeemBtn.addEventListener("click", function () {
        var scInput = document.getElementById('scInput').value;
        var passwordInput = document.getElementById('passwordInput').value;

        if (!scInput || !passwordInput) {
            setMessage("Please fill in the required fields", "red");
            clearPrize();
        } else {
            fetch(gistUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    var gistData = data.files['redeemed-codes.json'].content;
                    var redeemedCodes = JSON.parse(gistData);

                    if (validCodes.hasOwnProperty(scInput)) {
                        if (isCodeRedeemed(scInput, redeemedCodes)) {
                            setMessage("Code has already been redeemed.", "red");
                            clearPrize();
                        } else {
                            redeemCode(scInput, redeemedCodes);
                            updateGist(redeemedCodes); // Call the function to update the Gist content
                            setMessage(`Code redeemed successfully! You've got ${validCodes[scInput]}`, "green");
                        }
                    } else {
                        setMessage("Code is invalid.", "red");
                        clearPrize();
                    }
                })
                .catch(error => {
                    console.error('Error fetching Gist:', error);
                });
        }
    });

    function setMessage(text, color) {
        message.textContent = text;
        message.style.color = color;
    }

    function clearPrize() {
        prizeDisplay.textContent = "";
    }

    function isCodeRedeemed(code, redeemedCodes) {
        return code in redeemedCodes;
    }

    function redeemCode(code, redeemedCodes) {
        redeemedCodes[code] = true;
    }

    function updateGist(redeemedCodes) {
        var updatedData = {
            files: {
                'redeemed-codes.json': {
                    content: JSON.stringify(redeemedCodes, null, 2)
                }
            }
        };

        var requestOptions = {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer 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', // Replace with your actual GitHub personal access token
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        };

        fetch(gistUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating Gist');
                }
                console.log('Gist updated successfully');
            })
            .catch(error => {
                console.error('Error updating Gist:', error);
            });
    }
});