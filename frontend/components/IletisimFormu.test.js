import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    //1 - Arrange
    render(<IletisimFormu />);
    
    //2 - Action and Assert
    expect(screen.getByText('Gönder')).toBeInTheDocument();
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);
    expect(screen.getByText('İletişim Formu')).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    const adInput = screen.getByPlaceholderText('İlhan');
    userEvent.type(adInput, 'a');
    expect(screen.getByText('Hata: ad en az 5 karakter olmalıdır.')).toBeInTheDocument();
    userEvent.clear(adInput);
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    fireEvent.click(screen.getByText('Gönder'));

    await waitFor (() => expect(screen.getByText('Hata: ad en az 5 karakter olmalıdır.')).toBeInTheDocument());
    await waitFor (() => expect(screen.getByText('Hata: soyad gereklidir.')).toBeInTheDocument());
    await waitFor (() => expect(screen.getByText('Hata: email geçerli bir email adresi olmalıdır.')).toBeInTheDocument());
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    const adInput = screen.getByPlaceholderText('İlhan');
    const soyadInput = screen.getByPlaceholderText('Mansız');
    userEvent.type(adInput, 'Abdurrahman');
    userEvent.type(soyadInput, 'Bağrıaçık');
 
    fireEvent.click(screen.getByText('Gönder'));

    await waitFor (() => expect(screen.getByText('Hata: email geçerli bir email adresi olmalıdır.')).toBeInTheDocument());

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const emailInput = screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com');
    userEvent.type(emailInput, 'hotmail');

    await waitFor (() => expect(screen.getByText('Hata: email geçerli bir email adresi olmalıdır.')).toBeInTheDocument());
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    
    const soyadInput = screen.getByPlaceholderText('Mansız');
    userEvent.type(soyadInput, '');

    fireEvent.click(screen.getByText('Gönder'));

    await waitFor (() => expect(screen.getByText('Hata: soyad gereklidir.')).toBeInTheDocument());

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />);
    const adInput = screen.getByPlaceholderText('İlhan');
    const soyadInput = screen.getByPlaceholderText('Mansız');
    const emailInput = screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com');
    userEvent.type(adInput, 'Okyanus');
    userEvent.type(soyadInput, 'Aydoğan');
    userEvent.type(emailInput, 'yüzyılıngolcüsü@hotmail.com');
    fireEvent.click(screen.getByText('Gönder'));

    await waitFor (() => expect(screen.queryByText('Hata')).toBeNull);
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />);

    const adInput = screen.getByPlaceholderText('İlhan');
    const soyadInput = screen.getByPlaceholderText('Mansız');
    const emailInput = screen.getByPlaceholderText('yüzyılıngolcüsü@hotmail.com');
    const mesajInput = screen.getByLabelText('Mesaj');

    userEvent.type(adInput, 'Okyanus');
    userEvent.type(soyadInput, 'Aydoğan');
    userEvent.type(emailInput, 'yüzyılıngolcüsü@hotmail.com');
    userEvent.type(mesajInput ,screen.getByLabelText('Mesaj'));

    fireEvent.click(screen.getByText('Gönder'));
    userEvent.type(adInput, '');
    userEvent.type(soyadInput, '');
    userEvent.type(emailInput, '');
    userEvent.type(mesajInput ,'');

    await waitFor (() => expect(screen.getByText('Okyanus')).toBeInTheDocument());
    await waitFor (() => expect(screen.getByText('Aydoğan')).toBeInTheDocument());
    await waitFor (() => expect(screen.getByText('yüzyılıngolcüsü@hotmail.com')).toBeInTheDocument());
    await waitFor (() => expect(screen.getByText('Mesaj')).toBeInTheDocument());


});
