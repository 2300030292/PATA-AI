import React, { useState } from "react";
import AddressCard from "./AddressCard";
import ConfidenceBar from "./ConfidenceBar";
import EvidenceList from "./EvidenceList";
import DeliveryMap from "../Map/DeliveryMap";

const AddressResolver = () => {

  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");


  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";
    speech.rate = 1;

    window.speechSynthesis.speak(speech);
  };


  const startListening = () => {
const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => {
    alert("🎤 Listening... Speak now!");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    alert("You said: " + transcript);
    setAddress(transcript);
  };

  recognition.onerror = (event) => {
    alert("Speech Error: " + event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended.");
  };

  recognition.start();
};
  const resolveAddress = async () => {

    console.log("Resolve button clicked");


    if (!address.trim()) {

      alert("Please enter an address.");

      return;

    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/resolve-address",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            address,
          }),

        }
      );


      const data = await response.json();


      console.log(data);


      setResult(data);


    } catch (err) {

      console.error("Fetch Error:", err);


      alert(
        "Message: " +
        err.message +
        "\n\nName: " +
        err.name
      );

    }


    setLoading(false);

  };


  return (

    <div className="p-5">


      {listening && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-10 text-center shadow-xl">

            <div className="text-5xl">
              🎤
            </div>


            <h2 className="text-2xl font-bold mt-4">
              Speak Now
            </h2>


            <p className="text-gray-600 mt-2">
              Listening for your location...
            </p>


          </div>

        </div>

      )}



      <h1 className="text-4xl font-bold text-center mb-3">

        📍 AI Address Resolver

      </h1>


      <p className="text-center text-gray-600 mb-8">

        Resolve messy Indian addresses using Gemini AI,
        OpenStreetMap and India Post Pincode Dataset.

      </p>



      <div className="flex gap-3 mb-8">


        <input

          className="flex-1 border rounded-lg p-3"

          placeholder="Example: Opposite Ganesh Temple, KPHB Colony, Hyderabad"

          value={address}

          onChange={(e) => setAddress(e.target.value)}

        />


        <button

          onClick={startListening}

          className="bg-purple-600 text-white px-5 rounded-lg"

        >

          🎤 Voice

        </button>


        <button

          onClick={resolveAddress}

          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"

        >

          {loading ? "Resolving..." : "Resolve"}

        </button>


      </div>



      {spokenText && (

        <p className="text-green-600 mb-5">

          You said: {spokenText}

        </p>

      )}
          {result && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          <div className="space-y-6">

            <AddressCard result={result} />


            <ConfidenceBar
              confidence={result.confidence}
            />


            <EvidenceList
              evidence={result.evidence}
            />

          </div>



          <div className="bg-white rounded-xl shadow-lg p-5">


            <h2 className="text-2xl font-bold mb-4">

              🗺 Verified Location

            </h2>



            <div className="h-[500px] rounded-lg overflow-hidden">


              <DeliveryMap

                resolvedAddress={{

                  latitude: Number(result.latitude),

                  longitude: Number(result.longitude),


                  original_address:
                    result.original_address,


                  corrected_address:
                    result.corrected_address,


                  landmark:
                    result.landmark,


                  pincode:
                    result.pincode,


                  confidence:
                    result.confidence,

                }}

              />


            </div>


          </div>


        </div>

      )}


    </div>

  );

};


export default AddressResolver;