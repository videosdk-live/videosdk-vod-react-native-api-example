import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, ToastAndroid } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { REACT_APP_SERVER_URL, REACT_APP_VIDEOSDK_URL } from "@env";

export default function App() {
  const [selectedFile, setSelectedFile] = useState("");
  const [token, settoken] = useState("");
  const [storageURL, setstorageURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [videoInfo, setvideoInfo] = useState({
    videoId: "",
    fileUrl: "",
  });

  const getToken = async () => {
    try {
      const response = await fetch(`${REACT_APP_SERVER_URL}/get-token`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const { token } = await response.json();
      return token;
    } catch (e) {
      console.log(e);
    }
  };

  const fetchStorageAPI = async (token) => {
    try {
      const response = await fetch(`${REACT_APP_VIDEOSDK_URL}/v1/files`, {
        method: "POST",
        headers: {
          Authorization: token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const resp = await response.json();
      return resp;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(async () => {
    const token = await getToken();
    const { url } = await fetchStorageAPI(token);
    settoken(token);
    setstorageURL(url);
  }, []);

  const onUpload = async () => {
    setIsUploading(true);
    var fData = new FormData();
    const name = selectedFile.path.split("/")[9];
    fData.append("file", {
      name: name,
      uri: selectedFile.path,
      type: selectedFile.mime,
    });

    var options = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
      body: fData,
    };

    try {
      fetch(storageURL, options)
        .then((response) => response.json())
        .then((data) => {
          setvideoInfo({
            videoId: data.id,
            fileUrl: data.fileUrl,
          });
          setIsUploading(false);
          ToastAndroid.show("Video Uploaded Successfully", ToastAndroid.LONG);
        })
        .catch((error) => console.log(error));
    } catch (e) {
      console.log("ERRR", e);
    }
  };

  const onEncode = () => {
    const url = `${REACT_APP_VIDEOSDK_URL}/v1/encoder/jobs`;
    var options = {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId: videoInfo.videoId,
        presets: [
          {
            resolutions: ["240"],
            format: "hls",
          },
          {
            resolutions: ["240"],
            format: "mp4",
          },
        ],
        thumbnails: [
          {
            timestamp: "00:00:03",
            resolutions: ["240"],
            formats: ["jpg", "webp"],
            filters: ["none", "blur"],
          },
        ],
        webhookUrl: `http://webhook-url/video-encoded/60fab7e190288a03d0b7bee8`,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => console.log("data", data))
      .catch((err) => console.error("error:" + err));
  };

  const openImagePicker = () => {
    ImagePicker.openPicker({
      mediaType: "video",
      multiple: false,

      compressVideoPreset: "HighestQuality",
    })
      .then((video) => {
        setSelectedFile(video);
      })
      .catch((e) => {
        alert("File name not valid.");
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F6FF",
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: 12,
      }}
    >
      {selectedFile ? (
        <>
          {isUploading ? (
            <Text style={{ alignSelf: "center" }}>Uploading...</Text>
          ) : (
            <View style={{}}>
              <Text style={{ fontWeight: "bold" }}>File path : </Text>
              <Text style={{ fontSize: 16 }}>{selectedFile.path}</Text>
            </View>
          )}
          <View>
            <TouchableOpacity
              onPress={onUpload}
              style={{
                padding: 12,
                backgroundColor: "#4AA96C",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <Text style={{ fontSize: 22 }}>Upload</Text>
            </TouchableOpacity>

            {videoInfo.fileUrl ? (
              <>
                <View style={{ marginVertical: 16 }}>
                  <Text style={{ fontWeight: "bold" }}>File URL : </Text>
                  <Text style={{ fontSize: 16 }}>{videoInfo.fileUrl}</Text>
                </View>

                <TouchableOpacity
                  onPress={onEncode}
                  style={{
                    padding: 16,
                    backgroundColor: "#4AA96C",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 22 }}>Encode</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </>
      ) : (
        <TouchableOpacity
          onPress={openImagePicker}
          style={{
            padding: 16,
            backgroundColor: "#4AA96C",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 22 }}>Select a File</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
