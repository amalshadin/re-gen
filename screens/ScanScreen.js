import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Share, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeItemWithGemini } from '../api/gemini';
import { AppContext } from '../context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import CameraScreen from './CameraScreen';

const ScanScreen = () => {
    const { colors, addPoints, addScanToHistory } = useContext(AppContext);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setImage(pickerResult.assets[0].uri);
            setResult(null);
            handleAnalyze(pickerResult.assets[0].uri);
        }
    };

const handleAnalyze = async (imageUri) => {
    setLoading(true);
    try {
        // This now calls the REAL Gemini API function
        const analysisResult = await analyzeItemWithGemini(imageUri);
        
        setResult(analysisResult);
        addPoints(analysisResult.ecoPoints);
        addScanToHistory(analysisResult);
    } catch (error) {
        console.error(error);
        Alert.alert('Analysis Failed', 'Could not analyze the image. Please try again.');
    } finally {
        setLoading(false);
    }
};

    // Share result
    const onShare = async () => {
        try {
            await Share.share({
                message: `EcoMind Suggestion for ${result.itemName}: ${result.disposalMethod}. Eco-Tip: ${result.ecoTip}`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const styles = getStyles(colors);

    // If the camera is active, render it fullscreen
    if (showCamera) {
        return (
            <CameraScreen
                onPictureTaken={(uri) => {
                    setImage(uri);
                    setShowCamera(false);
                    setResult(null);
                    handleAnalyze(uri);
                }}
                onCancel={() => setShowCamera(false)}
            />
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan an Item</Text>
                <Text style={styles.subtitle}>Let's find the most eco-friendly way to dispose it.</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setShowCamera(true)}>
                    <Ionicons name="camera" size={24} color={colors.card} />
                    <Text style={styles.buttonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Ionicons name="images" size={24} color={colors.card} />
                    <Text style={styles.buttonText}>Upload Image</Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Analyzing...</Text>
                </View>
            )}

            {image && !loading && (
                <View style={styles.centered}>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            )}

            {result && !loading && (
                <View style={[styles.card, styles.resultCard]}>
                    <TouchableOpacity onPress={onShare} style={styles.shareIcon}>
                        <Ionicons name="share-social" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.resultTitle}>{result.itemName}</Text>

                    <ResultRow icon="leaf" label="Eco-Points Awarded" value={`+${result.ecoPoints}`} />
                    <ResultRow icon="trash-bin" label="Disposal Method" value={result.disposalMethod} />
                    <ResultRow icon="swap-horizontal" label="Alternative" value={result.alternative} />
                    <ResultRow icon="bulb" label="Upcycling Idea" value={result.upcyclingIdea} />
                    <ResultRow icon="earth" label="Eco Tip" value={result.ecoTip} />
                </View>
            )}
        </ScrollView>
    );
};

const ResultRow = ({ icon, label, value }) => {
    const { colors } = useContext(AppContext);
    const styles = getStyles(colors);
    return (
        <View style={styles.resultRow}>
            <Ionicons name={icon} size={20} color={colors.primary} style={styles.resultIcon} />
            <View>
                <Text style={styles.resultLabel}>{label}</Text>
                <Text style={styles.resultValue}>{value}</Text>
            </View>
        </View>
    );
};

const getStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, padding: 20 },
        header: { marginBottom: 30, alignItems: 'center' },
        title: { fontSize: 28, fontWeight: 'bold', color: colors.text },
        subtitle: { fontSize: 16, color: colors.primary, marginTop: 5 },
        buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 3,
        },
        buttonText: { color: colors.card, fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
        centered: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
        image: { width: 300, height: 225, borderRadius: 15, borderWidth: 2, borderColor: colors.primary },
        loadingText: { marginTop: 10, fontSize: 16, color: colors.text },
        card: { backgroundColor: colors.card, borderRadius: 15, padding: 20, marginBottom: 20, elevation: 4 },
        resultCard: { position: 'relative' },
        resultTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 15, textAlign: 'center' },
        resultRow: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
        resultIcon: { marginRight: 15, marginTop: 2 },
        resultLabel: { fontSize: 14, color: colors.text, fontWeight: 'bold', opacity: 0.7 },
        resultValue: { fontSize: 16, color: colors.text, flexShrink: 1 },
        shareIcon: { position: 'absolute', top: 15, right: 15, zIndex: 1 },
    });

export default ScanScreen;