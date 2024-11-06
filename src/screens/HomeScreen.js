import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isSameMonth } from 'date-fns';
import CustomButton from '../components/CustomButton'; // Importando seu componente CustomButton

const HomeScreen = ({ navigation }) => {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadConsultas); // Atualiza as consultas quando a tela ganha foco
    return unsubscribe;
  }, [navigation]);

  // Função para carregar as consultas do armazenamento
  const loadConsultas = async () => {
    const storedConsultas = JSON.parse(await AsyncStorage.getItem('consultas')) || [];
    const consultasMesAtual = storedConsultas.filter(consulta => 
      isSameMonth(new Date(consulta.date), new Date())
    );
    setConsultas(consultasMesAtual);
  };

  // Navegar para a tela de criação de nova consulta
  const handleNovaConsulta = () => navigation.navigate('ConsultaForm');

  // Função para excluir uma consulta pelo ID
  const handleDelete = async (id) => {
    if (!id) return; // Garantir que id seja válido
    // Confirmar a exclusão antes de prosseguir
    Alert.alert(
      'Excluir Consulta',
      'Tem certeza que deseja excluir esta consulta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            const storedConsultas = JSON.parse(await AsyncStorage.getItem('consultas')) || [];
            const updatedConsultas = storedConsultas.filter(consulta => consulta.id !== id);
            await AsyncStorage.setItem('consultas', JSON.stringify(updatedConsultas));
            loadConsultas(); // Atualizar a lista de consultas
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultas do Mês Atual</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.id.toString()} // Converter id para string
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Paciente: {item.paciente}</Text>
            <Text style={styles.itemText}>Data: {format(new Date(item.date), 'dd/MM/yyyy HH:mm')}</Text>
            <Text style={styles.itemText}>Valor: R$ {item.valor.toFixed(2)}</Text> {/* Exibe o valor formatado */}
            <Text style={styles.itemText}>Tipo: {item.tipo}</Text> {/* Exibe o tipo de consulta */}
            <View style={styles.buttonContainer}>
              <Button 
                title="Editar" 
                onPress={() => navigation.navigate('ConsultaForm', { consulta: item })} 
                color="#007bff" // Cor do botão de editar
              />
              <Button 
                title="Excluir" 
                color="red" 
                onPress={() => handleDelete(item.id)} 
              />
            </View>
          </View>
        )}
      />
      {/* Botão fixo na parte inferior usando seu componente CustomButton */}
      <View style={styles.fixedButtonContainer}>
        <CustomButton title="Nova Consulta" onPress={handleNovaConsulta} />
      </View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#b5838d', // Cor de fundo principal
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Cor do título
    textAlign: 'center', // Centraliza o título horizontalmente
    top: 15
  },
  itemContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Para Android
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // Cor do texto
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  // Estilo para o botão fixo na parte inferior
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,  // Distância de 20 pixels da parte inferior
    left: '60%',  // Centraliza horizontalmente
    transform: [{ translateX: -100 }],  // Ajuste para garantir centralização do botão
    width: '80%',  // Largura do botão
  },
});

export default HomeScreen;
