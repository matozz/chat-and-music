import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ProgressLabel from "react-progress-label";
import { Audio } from "expo-av";

const SOUND_SAMPLES = {
  Drum1T: {
    uri: require("../Samples/ThisF/Drum1-4.mp3"),
  },
  HiHat1T: {
    uri: require("../Samples/ThisF/HH1-32.mp3"),
  },
  Bass1T: {
    uri: require("../Samples/ThisF/Bass1-16.mp3"),
  },
  Chord1T: {
    uri: require("../Samples/ThisF/Chord1-16.mp3"),
  },
  Guitar1T: {
    uri: require("../Samples/ThisF/Guitar1-16.mp3"),
  },
  Guitar2T: {
    uri: require("../Samples/ThisF/Guitar2-8.mp3"),
  },
  Vocal1T: {
    uri: require("../Samples/ThisF/Vocal1-16.mp3"),
  },
  Violin1T: {
    uri: require("../Samples/ThisF/Violin1-8.mp3"),
  },
  Piano1T: {
    uri: require("../Samples/ThisF/Piano1-8.mp3"),
  },
  Drum1H: {
    uri: require("../Samples/Hope/Drum1-4.mp3"),
  },
  Bass1H: {
    uri: require("../Samples/Hope/Bass1-8.mp3"),
  },
  Melody1H: {
    uri: require("../Samples/Hope/Melody1-16.mp3"),
  },
  Siren1H: {
    uri: require("../Samples/Hope/Siren1-4.mp3"),
  },
  Drum1R: {
    uri: require("../Samples/Roses/Drum1-8.mp3"),
  },
  Synth1R: {
    uri: require("../Samples/Roses/Synth1-8.mp3"),
  },
  Chord2R: {
    uri: require("../Samples/Roses/Chord2-16.mp3"),
  },
  Chord1R: {
    uri: require("../Samples/Roses/Chord1-16.mp3"),
  },
  Vocal1R: {
    uri: require("../Samples/Roses/Vocal1-16.mp3"),
  },
  Woo1R: {
    uri: require("../Samples/Roses/Woo-4.mp3"),
  },
  Woo2R: {
    uri: require("../Samples/Roses/Woo2-2.mp3"),
  },
  Drum1C: {
    uri: require("../Samples/CYM/Drum1-8.mp3"),
  },
  HiHat1C: {
    uri: require("../Samples/CYM/HiHat1-8.mp3"),
  },
  Bass1C: {
    uri: require("../Samples/CYM/Bass1-32.mp3"),
  },
  Synth1C: {
    uri: require("../Samples/CYM/Synth1-8.mp3"),
  },
  Guitar1C: {
    uri: require("../Samples/CYM/Guitar1-16.mp3"),
  },
  Guitar2C: {
    uri: require("../Samples/CYM/Guitar2-16.mp3"),
  },
  Piano1C: {
    uri: require("../Samples/CYM/Piano1-16.mp3"),
  },
  Drum1L: {
    uri: require("../Samples/Closer/Drum1-16.mp3"),
  },
  Bass1L: {
    uri: require("../Samples/Closer/Bass1-8.mp3"),
  },
  Chord1L: {
    uri: require("../Samples/Closer/Chord1-8.mp3"),
  },
  HiHat1L: {
    uri: require("../Samples/Closer/HiHat1-8.mp3"),
  },
  Synth1L: {
    uri: require("../Samples/Closer/Synth1-16.mp3"),
  },
  Guitar1L: {
    uri: require("../Samples/Closer/Guitar1-4.mp3"),
  },
  Piano1L: {
    uri: require("../Samples/Closer/Piano1-8.mp3"),
  },
};

const PadItem = ({
  type,
  color,
  time,
  instrument,
  steps,
  bpm,
  sampleName,
  displayName,
  status,
}) => {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(steps);
  const [currentStep, setCurrentStep] = useState(1);
  const [sound1, setSound1] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSound = async () => {
      setLoading(true);
      console.log("Loading Sound");
      const initialStatus = {
        rate: bpm / 105,
        shouldCorrectPitch: true,
        pitchCorrectionQuality: Audio.PitchCorrectionQuality.High,
      };
      const { sound } = await Audio.Sound.createAsync(
        SOUND_SAMPLES[sampleName].uri,
        initialStatus
      );
      setSound1(sound);
      setLoading(false);
    };
    getSound();
  }, [bpm]);

  async function playSound() {
    console.log("Playing Sound");
    await sound1.playAsync();
    sound1.setProgressUpdateIntervalAsync(100);
    // sound1.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate1);
    // await sound1.setIsLoopingAsync(true);
  }

  const onPlaybackStatusUpdate1 = (playBackStatus) => {
    console.log(playBackStatus);
    const { didJustFinish } = playBackStatus;
    if (didJustFinish) {
      console.log("finish");
      sound1.replayAsync();
    }
  };

  useEffect(() => {
    Audio.setIsEnabledAsync(true);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // useEffect(() => {
  //   return sound1
  //     ? () => {
  //         console.log("Unloading Sound");
  //         sound1.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound1]);

  useEffect(() => {
    if (status == "play") {
      if (type == "shot" && playing) {
        setCurrentStep(currentStep + 1);
        if (currentStep == step) {
          setPlaying(false);
          setCurrentStep(1);
          sound1 &&
            sound1
              .getStatusAsync()
              .then((status) => status.isPlaying && sound1.stopAsync())
              .then(() => sound1.setPositionAsync(0));
        }

        return;
      }
      if (ready) {
        if (!playing) {
          setCurrentStep(1);
          if (time % 4 == 1) {
            setPlaying(true);
            playSound();
          }
        } else {
          setCurrentStep(currentStep + 1);
        }

        // sound1.setPositionAsync(466 * ((time % step) - 1));
        // console.log(time % step);
        // sound1.getStatusAsync().then((status) => console.log(status));
        // if (currentStep % step == 0) {
        //   console.log("Time Sync");
        //   sound1.replayAsync();
        // }
      } else {
        setCurrentStep(currentStep + 1);
        // console.log(time % 4);
        if (time % 4 == 1) {
          setPlaying(false);
          setCurrentStep(1);
          sound1 &&
            sound1
              .getStatusAsync()
              .then((status) => status.isPlaying && sound1.stopAsync())
              .then(() => sound1.setPositionAsync(0));
        }
        // if (time % 4 == 1) {
        //   setTimeout(() => {

        //   }, 300);
        // }
      }
    } else {
      setPlaying(false);
      setCurrentStep(1);
      setTimeout(() => {
        sound1 &&
          sound1
            .getStatusAsync()
            .then((status) => status.isPlaying && sound1.stopAsync())
            .then(() => sound1.setPositionAsync(0));
      }, 300);
      setReady(false);
    }
  }, [time, status]);

  return (
    <View style={{ flex: 1, borderRightWidth: 1 }}>
      <TouchableOpacity
        onPress={() => {
          if (type != "shot") setReady(!ready);
          else {
            if (status == "play") {
              setPlaying(true);
              playSound();
            }
          }
          // playSound();
        }}
        style={{
          alignItems: "center",
          height: 72,
          justifyContent: "center",
          backgroundColor: playing ? color : "transparent",
          borderRadius: 10,
          position: "relative",
        }}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9,
              backgroundColor: "rgba(1,1,1,0.4)",
            }}
          />
        )}

        {type === "loop" && (
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                backgroundColor: playing ? "#252525" : color,
                height: 38,
                width: 38,
                borderRadius: "100%",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  backgroundColor: playing ? color : "#252525",
                  borderRadius: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* <Text
                style={{
                  color: playing ? "#252525" : color,
                  fontWeight: "bold",
                }}
              >
                {time}
              </Text> */}
                {playing && (
                  <ProgressLabel
                    size={40}
                    progress={100 / step}
                    trackColor={color}
                    progressColor="#efefef"
                    progressWidth={4}
                    trackWidth={4}
                    cornersWidth={1}
                    style={[
                      {
                        transform: [
                          { rotate: `${((currentStep - 1) * 360) / step}deg` },
                        ],
                      },
                    ]}
                  />
                )}
                {steps == 2 && (
                  <>
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        width: 5,
                        height: 40,
                      }}
                    />
                  </>
                )}
                {steps == 4 && (
                  <>
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        width: 5,
                        height: 40,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        transform: [{ rotate: "90deg" }],
                        width: 5,
                        height: 40,
                      }}
                    />
                  </>
                )}
                {steps == 8 && (
                  <>
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        width: 5,
                        height: 40,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        transform: [{ rotate: "45deg" }],
                        width: 5,
                        height: 40,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        transform: [{ rotate: "90deg" }],
                        width: 5,
                        height: 40,
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        transform: [{ rotate: "135deg" }],
                        width: 5,
                        height: 40,
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        )}
        {type === "shot" && (
          <View
            style={{
              width: 60,
              backgroundColor: playing ? "#252525" : color,
              height: 4,
              borderRadius: 10,
              marginHorizontal: 7.5,
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
              // paddingHorizontal: 2,
            }}
          >
            {/* <Text
            style={{
              position: "absolute",
              top: -20,
              color: playing ? "#252525" : color,
              fontWeight: "bold",
            }}
          >
            {((60 / step) * (currentStep - 1)) % 60}
          </Text> */}
            {playing && (
              <View
                style={[
                  {
                    height: 6,
                    width: 60 / step,
                    backgroundColor: "#efefef",
                    borderRadius: 10,
                    alignSelf: "flex-start",
                  },
                  {
                    transform: [
                      { translateX: ((60 / step) * (currentStep - 1)) % 60 },
                    ],
                  },
                ]}
              />
            )}
            {steps == 2 && (
              <>
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: playing ? color : "#252525",
                    width: 5,
                    height: 6,
                  }}
                />
              </>
            )}
            {steps == 4 && (
              <>
                <View
                  style={{
                    position: "absolute",
                    left: 12,
                    backgroundColor: playing ? color : "#252525",
                    width: 5,
                    height: 6,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: playing ? color : "#252525",
                    width: 5,
                    height: 6,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    right: 12,
                    backgroundColor: playing ? color : "#252525",
                    width: 5,
                    height: 6,
                  }}
                />
              </>
            )}
          </View>
        )}
        <Text
          style={{
            marginTop: 6,
            color: playing ? "#252525" : color,
            fontWeight: "500",
            fontSize: 11,
          }}
        >
          {displayName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PadItem;

const styles = StyleSheet.create({});
