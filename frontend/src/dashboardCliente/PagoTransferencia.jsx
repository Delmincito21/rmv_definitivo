import React, { useState } from 'react';

function PagoTransferencia({ onSubmit, id_venta, monto }) {
    const [voucher, setVoucher] = useState(null);
    const [referencia, setReferencia] = useState('');
    const [banco, setBanco] = useState('BHD');
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setVoucher(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!voucher) {
            setError('Debes subir el comprobante de la transferencia.');
            return;
        }
        if (!referencia) {
            setError('Debes ingresar la referencia de la transferencia.');
            return;
        }
        setError('');
        const formData = new FormData();
        formData.append('monto_pago', monto);
        formData.append('referencia', referencia);
        formData.append('banco_emisor', banco);
        formData.append('voucher', voucher);
        formData.append('fecha_pago', new Date().toISOString());

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: '0 auto', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #2563eb22', padding: 32 }}>
            <h3 style={{ color: '#176bb3', fontSize: 24, fontWeight: 700, marginBottom: 18, textAlign: 'center' }}>Datos para Transferencia</h3>
            <div style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <p style={{ color: '#222', fontSize: 16 }}><b>Banco:</b> BHD</p>
                <p style={{ color: '#222', fontSize: 16 }}><b>Tipo de cuenta:</b> Ahorro</p>
                <p style={{ color: '#222', fontSize: 16 }}><b>Número de cuenta:</b> 1234567890</p>
                <p style={{ color: '#222', fontSize: 16 }}><b>Titular:</b> Refrielectric MV S.R.L</p>
            </div>
            <div style={{ marginBottom: 18 }}>
                <label style={{ color: '#222', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Referencia de la transferencia:</label>
                <input
                    type="text"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    required
                    style={{ width: '100%', background: '#fff', color: '#222', fontSize: 17, border: '1.5px solid #dbeafe', borderRadius: 8, padding: '12px 14px', marginBottom: 8 }}
                />
            </div>
            <div style={{ marginBottom: 18 }}>
                <label style={{ color: '#222', fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Sube el comprobante (voucher):</label>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    required
                    style={{ background: '#fff', color: '#222', fontSize: 16, border: '1.5px solid #dbeafe', borderRadius: 8, padding: '10px 8px' }}
                />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 8, fontSize: 16 }}>{error}</div>}
            <button type="submit" style={{ background: '#176bb3', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 17, cursor: 'pointer', width: '100%', marginTop: 8 }}>Enviar comprobante</button>
        </form>
    );
}

export default PagoTransferencia;
