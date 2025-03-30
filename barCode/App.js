import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Linking } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function App() {
  // Estado para armazenar a permissão da câmera
  const [temPermissao, setTemPermissao] = useState(null);

  // Estado para indicar se um código foi digitalizado
  const [digitalizado, setDigitalizado] = useState(false);

  // Estado para armazenar os dados do código digitalizado
  const [dados, setDados] = useState(null);

  // useEffect para solicitar permissão da câmera ao montar o componente
  useEffect(() => {
    const obterPermissoesDaCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === "granted");};
      obterPermissoesDaCamera();}, []);

  // Função para lidar com o código digitalizado
    const lidarComCodigoDigitalizado = ({ type, data }) => {
    setDigitalizado(true);
    setDados(data);
    alert(`Código de barras do tipo ${type} e dados ${data} foram digitalizados!`);
  };
// Função para abrir o link contido nos dados do código digitalizado
const abrirLink = () => {
  Linking.openURL(dados);
};

// Renderização condicional baseada na permissão da câmera
if (temPermissao === null) {
  return <Text>Solicitando permissão para usar a câmera</Text>;
}

if (temPermissao === false) {
  return <Text>Sem acesso à câmera</Text>;
}

// Renderização do componente principal
return (
  <View style={styles.container}>
    <CameraView
      onBarcodeScanned={digitalizado ? undefined : lidarComCodigoDigitalizado}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417"],
      }}
      style={StyleSheet.absoluteFillObject}
    />
    <MaterialCommunityIcons
      name="qrcode-scan"
      size={100}
      color="orange"
      style={styles.icone}
    />
    <Text style={styles.titulo}>Leitor de QR Code</Text>
    {digitalizado && (
      <Button
        color="orange"
        title="Toque para digitalizar novamente"
        onPress={() => setDigitalizado(false)}
      />
    )}
    {digitalizado && (
      <View style={styles.segBotao}>
        <Button
          color="orange"
          title={"Abrir link: " + dados}
          onPress={abrirLink}
        />
      </View>
    )}
  </View>
);
}

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icone: {
    marginTop: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'darkorange',
  },
  segBotao: {
    marginTop: 15,
  },
});