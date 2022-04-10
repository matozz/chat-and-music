import React, { useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ProgressLabel from "react-progress-label";
import { Audio } from "expo-av";
import MusicContext from "../context/MusicContext";
import { PLACEHOLDER_LOOP_GAPS, SOUND_SAMPLES } from "../utils/SampleData";
import SocketContext from "../context/SocketContext";

const PadItem = React.memo(
  ({ type, color, steps, sampleName, displayName, row, col }) => {
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [step, setStep] = useState(steps);
    const [currentStep, setCurrentStep] = useState(1);
    const [sound1, setSound1] = useState();
    const [loading, setLoading] = useState(false);

    const {
      handleRecord,
      isRecording,
      time,
      playType,
      roomId,
      bpm,
      status,
      // triggerNote,
    } = useContext(MusicContext);

    const socket = useContext(SocketContext);

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

    useEffect(() => {
      Audio.setIsEnabledAsync(true);
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
        playsInSilentModeIOS: false,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        playThroughEarpieceAndroid: false,
      });

      return sound1
        ? () => {
            console.log("Unloading Sound");
            sound1.unloadAsync();
          }
        : undefined;
    }, []);

    useEffect(() => {
      // let { col, row, active } = triggerNote;
      // console.log(12, col, row, active);
    }, []);

    // console.log(col, row);

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
                .then((status) => {
                  status.isPlaying && sound1.stopAsync();
                })
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
        } else {
          setCurrentStep(currentStep + 1);
          if (time % 4 == 1) {
            setPlaying(false);
            setCurrentStep(1);
            sound1 &&
              sound1
                .getStatusAsync()
                .then((status) => {
                  status.isPlaying && sound1.stopAsync();
                })
                .then(() => sound1.setPositionAsync(0));
          }
        }
      } else {
        setPlaying(false);
        setCurrentStep(1);
        setTimeout(() => {
          sound1 &&
            sound1
              .getStatusAsync()
              .then((status) => {
                status.isPlaying && sound1.stopAsync();
              })
              .then(() => sound1.setPositionAsync(0));
        }, 300);
        setReady(false);
      }
    }, [time, status]);

    const handlePressPad = () => {
      // console.log(col, row);
      // if (col === 1 && row === 1) {
      //   console.log(123, col, row);
      //   setReady(true);
      // }
      if (isRecording) {
        handleRecord({ row: row, col: col, active: !ready });
      }
      if (playType === "live") {
        socket.emit(
          "send-music-note",
          { row: row, col: col, active: !ready },
          roomId
        );
      }
      if (type != "shot") {
        setReady(!ready);
      } else {
        if (status == "play") {
          setPlaying(true);
          playSound();
        }
      }
    };

    const playSound = async () => {
      console.log("Playing Sound");

      await sound1.playAsync();
      sound1.setProgressUpdateIntervalAsync(100);
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handlePressPad}
          style={{
            ...styles.pad,
            backgroundColor: playing ? color : "transparent",
          }}
          activeOpacity={0.5}
        >
          {loading && <ActivityIndicator size="small" style={styles.loader} />}

          {type === "loop" && (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  ...styles.loopOut,
                  backgroundColor: playing ? "#252525" : color,
                }}
              >
                <View
                  style={{
                    ...styles.looperIn,
                    backgroundColor: playing ? color : "#252525",
                  }}
                >
                  {playing && (
                    <ProgressLabel
                      size={38}
                      progress={100 / step}
                      trackColor={color}
                      progressColor="#efefef"
                      progressWidth={4}
                      trackWidth={4}
                      cornersWidth={1}
                      style={[
                        {
                          transform: [
                            {
                              rotate: `${((currentStep - 1) * 360) / step}deg`,
                            },
                          ],
                        },
                      ]}
                    />
                  )}
                  {PLACEHOLDER_LOOP_GAPS[step]?.map((deg, index) => (
                    <View
                      key={index}
                      style={{
                        position: "absolute",
                        backgroundColor: playing ? color : "#252525",
                        transform: [{ rotate: deg }],
                        width: step == 16 ? 2 : 5,
                        height: 40,
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
          {type === "shot" && (
            <View
              style={{
                ...styles.shot,
                backgroundColor: playing ? "#252525" : color,
              }}
            >
              {playing && (
                <View
                  style={[
                    {
                      height: 4,
                      width: 50 / step,
                      backgroundColor: "#efefef",
                      borderRadius: 10,
                      alignSelf: "flex-start",
                    },
                    {
                      transform: [
                        { translateX: ((50 / step) * (currentStep - 1)) % 50 },
                      ],
                    },
                  ]}
                />
              )}
              {steps == 2 && (
                <>
                  <View
                    style={{
                      ...styles.shotGap,
                      backgroundColor: playing ? color : "#252525",
                    }}
                  />
                </>
              )}
              {steps == 4 && (
                <>
                  <View
                    style={{
                      ...styles.shotGap,
                      left: 9,
                      backgroundColor: playing ? color : "#252525",
                    }}
                  />
                  <View
                    style={{
                      ...styles.shotGap,
                      backgroundColor: playing ? color : "#252525",
                    }}
                  />
                  <View
                    style={{
                      ...styles.shotGap,
                      right: 9,
                      backgroundColor: playing ? color : "#252525",
                    }}
                  />
                </>
              )}
            </View>
          )}
          <Text
            style={{
              ...styles.sampleName,
              color: playing ? "#252525" : color,
            }}
          >
            {displayName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

export default PadItem;

const styles = StyleSheet.create({
  container: { flex: 1, borderRightWidth: 1 },
  pad: {
    alignItems: "center",
    height: 70,
    justifyContent: "center",
    position: "relative",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
    backgroundColor: "rgba(1,1,1,0.4)",
  },
  loopOut: {
    height: 38,
    width: 38,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  looperIn: {
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  shot: {
    width: 50,
    height: 4,
    marginHorizontal: 7.5,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shotGap: {
    position: "absolute",
    width: 5,
    height: 4,
  },
  sampleName: {
    fontWeight: "500",
    fontSize: 12,
    marginTop: 6,
  },
});
