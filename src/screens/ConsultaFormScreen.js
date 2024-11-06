import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native'; // Importando Picker
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButton';

const ConsultaFormScreen = ({ route, navigation }) => {
  const [paciente, setPaciente] = useState('');
  const [date, setDate] = useState('');
  const [valor, setValor] = useState(''); // Novo estado para o valor
  const [tipo, setTipo] = useState('mensal'); // Novo estado para o tipo

  const { consulta } = route.params || {};

  useEffect(() => {
    if (consulta) {
      setPaciente(consulta.paciente);
      setDate(consulta.date);
      setValor(consulta.valor.toString()); // Certifica-se de que o valor esteja como string
      setTipo(consulta.tipo);
    }
  }, [consulta]);

  const handleSave = async () => {
    const newConsulta = { 
      id: consulta?.id || Date.now().toString(), 
      paciente, 
      date, 
      valor: parseFloat(valor), // Converte para float
      tipo 
    };
    const storedConsultas = JSON.parse(await AsyncStorage.getItem('consultas')) || [];
    
    if (consulta) {
      const index = storedConsultas.findIndex(item => item.id === consulta.id);
      storedConsultas[index] = newConsulta;
    } else {
      storedConsultas.push(newConsulta);
    }
    
    await AsyncStorage.setItem('consultas', JSON.stringify(storedConsultas));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Consulta</Text>
      <TextInput style={styles.input} placeholder="Paciente" value={paciente} onChangeText={setPaciente} />
      <TextInput style={styles.input} placeholder="Data" value={date} onChangeText={setDate} />
      <TextInput 
        style={styles.input} 
        placeholder="Valor" 
        value={valor} 
        keyboardType="numeric" 
        onChangeText={setValor} 
      />
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.select} // Aplicar o estilo na seleção
        >
          <Picker.Item label="Mensal" value="mensal" />
          <Picker.Item label="Quinzenal" value="quinzenal" />
        </Picker>
      </View>
      
      <View style={styles.fixedButtonContainer}>
        <CustomButton title="Salvar" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#b5838d', // Cor de fundo principal
  },

  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Para Android
  },

  pickerContainer: {
    width: '90%', // Largura da caixa do picker
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8, // Aumenta o raio para um arredondamento mais pronunciado
    overflow: 'hidden', // Garante que os cantos arredondados sejam mantidos
    marginBottom: 15,
  },

  select: {
    height: 50,
    backgroundColor: '#fff',
    color:'#ccc'
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff', // Cor do título
    textAlign: 'center', // Centraliza o título horizontalmente
    top: 15
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: '60%',
    transform: [{ translateX: -100 }],
    width: '80%',
  },
});

export default ConsultaFormScreen;
