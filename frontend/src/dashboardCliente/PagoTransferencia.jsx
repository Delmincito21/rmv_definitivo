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
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <h3>Datos para Transferencia</h3>
            <div style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <p><b>Banco:</b> BHD</p>
                <p><b>Tipo de cuenta:</b> Ahorro</p>
                <p><b>Número de cuenta:</b> 1234567890</p>
                <p><b>Titular:</b> Refrielectric MV S.R.L</p>
            </div>
            <div style={{ marginBottom: 12 }}>
                <label>Referencia de la transferencia:</label>
                <input
                    type="text"
                    value={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    required
                    style={{ width: '100%' }}
                />
            </div>
            <div style={{ marginBottom: 12 }}>
                <label>Sube el comprobante (voucher):</label>
                <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    required
                />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
            <button type="submit">Enviar comprobante</button>
        </form>
    );
}

export default PagoTransferencia;
