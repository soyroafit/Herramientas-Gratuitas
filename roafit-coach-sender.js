// roafit-coach-sender.js
// Módulo para enviar datos de trackers a tu coach via EmailJS

(function() {
    'use strict';

    // Configuración de EmailJS
    const EMAILJS_CONFIG = {
        publicKey: 'Db0CLad-rNtFZbAmE',
        serviceId: 'service_oih7v4a',
        templateId: 'template_3hnbih4'  // Template de confirmación (reutilizado)
    };

    // Inicializar EmailJS
    function initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
        }
    }

    // Crear el botón "Enviar a mi coach"
    function createCoachButton() {
        const button = document.createElement('button');
        button.id = 'sendToCoachBtn';
        button.innerHTML = 'Enviar a mi Coach';
        button.style.cssText = `
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1em;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
            margin: 20px 0;
            transition: transform 0.3s, box-shadow 0.3s;
            width: 100%;
            max-width: 400px;
        `;
        
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.3)';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
        
        button.addEventListener('click', openCoachModal);
        
        return button;
    }

    // Crear el modal de contacto
    function createCoachModal() {
        const modalHTML = `
            <div id="coachModal" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); overflow: auto;">
                <div style="background: white; margin: 50px auto; padding: 40px; border-radius: 20px; max-width: 500px; position: relative; animation: slideIn 0.3s;">
                    <span id="closeModal" style="position: absolute; top: 15px; right: 20px; font-size: 28px; font-weight: bold; cursor: pointer; color: #666;">&times;</span>
                    
                    <h2 style="color: #1a1a1a; margin-bottom: 10px;">Enviar a mi Coach</h2>
                    <p style="color: #666; margin-bottom: 30px;">¿Te gustaría recibir seguimiento personalizado? Completa estos datos y te contactaré para ayudarte.</p>
                    
                    <form id="coachContactForm">
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                Nombre completo <span style="color: #e74c3c;">*</span>
                            </label>
                            <input type="text" id="coachNombre" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                Email <span style="color: #e74c3c;">*</span>
                            </label>
                            <input type="email" id="coachEmail" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                WhatsApp
                            </label>
                            <input type="tel" id="coachWhatsapp" placeholder="+34 600 000 000" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px;">
                            <small style="color: #666; font-size: 0.9em;">Con código de país (opcional)</small>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                                ¿Qué te gustaría lograr?
                            </label>
                            <textarea id="coachObjetivo" rows="3" placeholder="Ejemplo: Perder grasa, ganar músculo, crear hábito de entrenar..." style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
                        </div>
                        
                        <button type="submit" id="sendCoachBtn" style="background: linear-gradient(135deg, #F2CB05 0%, #ffd700 100%); color: #1a1a1a; border: none; padding: 15px 30px; font-size: 1.1em; font-weight: bold; border-radius: 10px; cursor: pointer; width: 100%;">
                            Enviar Datos
                        </button>
                    </form>
                    
                    <div id="coachSuccessMsg" style="display: none; background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px;">
                        <h3 style="margin-bottom: 10px;">✅ ¡Datos enviados correctamente!</h3>
                        <p style="margin: 0;">He recibido tu información. Me pondré en contacto contigo en las próximas 24-48 horas por email o WhatsApp.</p>
                        <p style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">¡Gracias por tu interés!</p>
                    </div>
                    
                    <div id="coachErrorMsg" style="display: none; background: #e74c3c; color: white; padding: 20px; border-radius: 10px; text-align: center; margin-top: 20px;">
                        <h3 style="margin-bottom: 10px;">❌ Error al enviar</h3>
                        <p style="margin: 0;">Hubo un problema. Por favor, intenta de nuevo o contáctame por Instagram.</p>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideIn {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Event listeners para cerrar modal
        document.getElementById('closeModal').addEventListener('click', closeCoachModal);
        document.getElementById('coachModal').addEventListener('click', function(e) {
            if (e.target.id === 'coachModal') {
                closeCoachModal();
            }
        });
        
        // Event listener para el formulario
        document.getElementById('coachContactForm').addEventListener('submit', handleCoachFormSubmit);
    }

    // Abrir modal
    function openCoachModal() {
        document.getElementById('coachModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Cerrar modal
    function closeCoachModal() {
        document.getElementById('coachModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Exportar datos del tracker actual
    function exportTrackerData(trackerType) {
        const data = exportTrackerDataObject(trackerType);
        return JSON.stringify(data, null, 2);
    }
    
    // Exportar datos del tracker como objeto
    function exportTrackerDataObject(trackerType) {
        const data = {
            trackerType: trackerType,
            fecha: new Date().toLocaleString('es-ES'),
            datos: {},
            resumen: ''
        };
        
        // Obtener datos del localStorage según el tipo de tracker
        switch(trackerType) {
            case 'habitos':
                const habitData = JSON.parse(localStorage.getItem('fitnessTracker') || '{}');
                data.datos = habitData;
                data.resumen = crearResumenHabitos(habitData);
                break;
            case 'entrenamiento':
                const workoutData = JSON.parse(localStorage.getItem('gymWorkoutTracker') || '{}');
                data.datos = workoutData;
                data.resumen = crearResumenEntrenamiento(workoutData);
                break;
            case 'nutricion':
                data.datos = JSON.parse(localStorage.getItem('nutritionGoals') || '{}');
                data.resumen = 'Objetivos nutricionales registrados';
                break;
            case 'calorias':
                data.datos = JSON.parse(localStorage.getItem('calorieData') || '{}');
                data.resumen = 'Cálculo de calorías completado';
                break;
            default:
                data.datos = { mensaje: 'Datos del tracker' };
                data.resumen = 'Interesado en el servicio';
        }
        
        return data;
    }
    
    // Crear resumen legible de hábitos
    function crearResumenHabitos(habitData) {
        if (!habitData.checks || Object.keys(habitData.checks).length === 0) {
            return 'Sin datos registrados en el tracker';
        }
        
        const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
        const estrategias = {
            '1': 'Estrategia #1: La Regla de los 2 Minutos',
            '2': 'Estrategia #2: Imperfección Productiva',
            '3': 'Estrategia #3: Ancla de Hábitos'
        };
        
        // Organizar datos por estrategia y semana
        const datosOrganizados = {};
        Object.keys(habitData.checks).forEach(key => {
            const [estrategia, semana, dia] = key.split('-');
            if (!datosOrganizados[estrategia]) {
                datosOrganizados[estrategia] = {};
            }
            if (!datosOrganizados[estrategia][semana]) {
                datosOrganizados[estrategia][semana] = [];
            }
            datosOrganizados[estrategia][semana].push(parseInt(dia));
        });
        
        let resumen = '\n📋 TRACKER DE HÁBITOS - RESUMEN VISUAL\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        // Para cada estrategia usada
        Object.keys(datosOrganizados).forEach(estrategia => {
            resumen += `📍 ${estrategias[estrategia]}\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            let totalDias = 0;
            const semanas = datosOrganizados[estrategia];
            
            // Para cada semana
            for (let s = 1; s <= 4; s++) {
                const diasMarcados = semanas[s] || [];
                const numDias = diasMarcados.length;
                totalDias += numDias;
                const porcentaje = Math.round((numDias / 7) * 100);
                
                resumen += `📅 Semana ${s}: ${numDias} de 7 días completados (${porcentaje}%)\n`;
                resumen += '   ';
                
                // Mostrar cada día de la semana
                for (let d = 0; d < 7; d++) {
                    if (diasMarcados.includes(d)) {
                        resumen += `${dias[d]} ✅  `;
                    } else {
                        resumen += `${dias[d]} ⬜  `;
                    }
                }
                resumen += '\n\n';
            }
            
            const totalPosible = 28;
            const porcentajeTotal = Math.round((totalDias / totalPosible) * 100);
            resumen += `📊 TOTAL: ${totalDias} días completados de ${totalPosible} posibles (${porcentajeTotal}%)\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        });
        
        // Agregar notas si existen
        if (habitData.notes && habitData.notes.trim()) {
            resumen += '💭 REFLEXIONES DEL USUARIO:\n';
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
            resumen += habitData.notes + '\n';
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        }
        
        return resumen;
    }
    
    // Crear resumen legible del tracker de entrenamiento
    function crearResumenEntrenamiento(workoutData) {
        if (!workoutData || Object.keys(workoutData).length === 0) {
            return 'Sin datos registrados en el tracker';
        }
        
        let resumen = '\n💪 TRACKER DE ENTRENAMIENTO - RESUMEN VISUAL\n';
        resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        const diasNombres = {
            'day1': '🏋️ DÍA 1: TREN SUPERIOR',
            'day2': '🦵 DÍA 2: TREN INFERIOR',
            'day3': '💫 DÍA 3: CORE/ABDOMEN'
        };
        
        // Recorrer todas las semanas registradas
        Object.keys(workoutData).forEach(semanaNum => {
            const semanaData = workoutData[semanaNum];
            
            resumen += `📅 SEMANA ${semanaNum}\n`;
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
            
            // Para cada día de entrenamiento
            ['day1', 'day2', 'day3'].forEach(diaKey => {
                if (semanaData[diaKey] && semanaData[diaKey].exercises) {
                    resumen += `${diasNombres[diaKey]}\n\n`;
                    
                    semanaData[diaKey].exercises.forEach((ejercicio, idx) => {
                        if (ejercicio.name || ejercicio.series.some(s => s.reps || s.weight)) {
                            resumen += `   ${idx + 1}. ${ejercicio.name || 'Sin nombre'}\n`;
                            
                            // Mostrar series
                            ejercicio.series.forEach((serie, sIdx) => {
                                if (serie.reps || serie.weight) {
                                    resumen += `      Serie ${sIdx + 1}: ${serie.reps || '-'} reps x ${serie.weight || '-'} kg\n`;
                                }
                            });
                            
                            // Mostrar comentarios si existen
                            if (ejercicio.comments && ejercicio.comments.trim()) {
                                resumen += `      💬 ${ejercicio.comments}\n`;
                            }
                            resumen += '\n';
                        }
                    });
                    
                    resumen += '\n';
                }
            });
            
            // Agregar cardio si existe
            if (semanaData.cardio && semanaData.cardio.trim()) {
                resumen += '🏃 ACTIVIDAD CARDIOVASCULAR:\n';
                resumen += semanaData.cardio + '\n\n';
            }
            
            // Agregar notas generales si existen
            if (semanaData.notes && semanaData.notes.trim()) {
                resumen += '📝 NOTAS GENERALES DE LA SEMANA:\n';
                resumen += semanaData.notes + '\n\n';
            }
            
            resumen += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        });
        
        return resumen;
    }

    // Manejar envío del formulario
    function handleCoachFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('sendCoachBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Enviando...';
        
        // Obtener datos del formulario
        const nombre = document.getElementById('coachNombre').value;
        const email = document.getElementById('coachEmail').value;
        const whatsapp = document.getElementById('coachWhatsapp').value || 'No proporcionado';
        const objetivo = document.getElementById('coachObjetivo').value || 'No especificado';
        
        // Detectar tipo de tracker desde la URL
        const currentPage = window.location.pathname;
        let trackerType = 'general';
        if (currentPage.includes('Tracker-Nuevos-Habitos')) trackerType = 'habitos';
        else if (currentPage.includes('entrenamiento')) trackerType = 'entrenamiento';
        else if (currentPage.includes('objetivos-nutricionales')) trackerType = 'nutricion';
        else if (currentPage.includes('calculadora-calorias')) trackerType = 'calorias';
        
        // Exportar datos del tracker
        const exportedData = exportTrackerDataObject(trackerType);
        const trackerData = JSON.stringify(exportedData.datos, null, 2);
        
        // Preparar datos para enviarte A TI con los datos del lead
        const coachParams = {
            nombre: nombre + ' (Lead desde Tracker)',
            email: email,
            whatsapp: whatsapp,
            edad: 'Lead desde tracker',
            ciudad: 'Por confirmar',
            objetivo_principal: objetivo,
            tiempo_objetivo: 'Por definir',
            experiencia: 'Por definir',
            lesiones: 'No',
            lesiones_detalle: '',
            condiciones: 'Por confirmar',
            medicamentos: 'Por confirmar',
            tratamiento_perdida_peso: 'No',
            tratamiento_ganancia_muscular: 'No',
            peso: 'Por medir',
            altura: 'Por medir',
            actividad: 'Por evaluar',
            alimentacion: 'Por evaluar',
            dias_semana: 'Por definir',
            lugar: 'Por definir',
            equipo: 'Por definir',
            presupuesto: 'Por consultar',
            por_que_ahora: objetivo,
            obstaculos: 'Por identificar',
            expectativas: 'Seguimiento personalizado',
            informacion_adicional: exportedData.resumen + '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 DATOS TÉCNICOS (JSON):\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' + trackerData,
            fecha_envio: new Date().toLocaleString('es-ES')
        };
        
        // Enviar SOLO a ti usando el template de valoración
        emailjs.send(EMAILJS_CONFIG.serviceId, 'template_1t0lfe9', coachParams)
            .then(function(response) {
                console.log('Email al coach enviado!', response.status);
                
                // Mostrar mensaje de éxito
                document.getElementById('coachContactForm').style.display = 'none';
                document.getElementById('coachSuccessMsg').style.display = 'block';
                
                // Cerrar modal después de 3 segundos
                setTimeout(() => {
                    closeCoachModal();
                    // Reset form
                    document.getElementById('coachContactForm').reset();
                    document.getElementById('coachContactForm').style.display = 'block';
                    document.getElementById('coachSuccessMsg').style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Datos';
                }, 3000);
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Mostrar mensaje de error
                document.getElementById('coachErrorMsg').style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Datos';
                
                // Ocultar error después de 3 segundos
                setTimeout(() => {
                    document.getElementById('coachErrorMsg').style.display = 'none';
                }, 3000);
            });
    }

    // Función de inicialización pública
    window.RoafitCoachSender = {
        init: function(buttonContainerId) {
            // Inicializar EmailJS
            initEmailJS();
            
            // Crear y añadir botón
            const container = document.getElementById(buttonContainerId);
            if (container) {
                const button = createCoachButton();
                container.appendChild(button);
            }
            
            // Crear modal
            createCoachModal();
        }
    };
})();
