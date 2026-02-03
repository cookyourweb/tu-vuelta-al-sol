import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

// ==========================================
// 📥 POST: CREAR NUEVO LEAD DE ASTRÓLOGO
// ==========================================

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { nombre, email, telefono, experiencia, interes, source } = body;

    // Validaciones básicas
    if (!nombre || !email || !telefono) {
      return NextResponse.json({
        success: false,
        error: 'Nombre, email y teléfono son requeridos'
      }, { status: 400 });
    }

    // Verificar si ya existe un lead con ese email o teléfono
    const existingLead = await Lead.findOne({
      $or: [
        { email: email.toLowerCase() },
        { telefono: telefono }
      ]
    });

    if (existingLead) {
      // Actualizar el lead existente
      existingLead.nombre = nombre;
      existingLead.experiencia = experiencia || existingLead.experiencia;
      existingLead.interes = interes || existingLead.interes;
      existingLead.updatedAt = new Date();
      await existingLead.save();

      console.log('📝 [LEAD] Lead actualizado:', email);

      return NextResponse.json({
        success: true,
        message: 'Lead actualizado correctamente',
        lead: existingLead
      });
    }

    // Crear nuevo lead
    const newLead = new Lead({
      nombre,
      email: email.toLowerCase(),
      telefono,
      experiencia: experiencia || '',
      interes: interes || '',
      source: source || 'formacion-astrologos',
      status: 'nuevo'
    });

    await newLead.save();

    console.log('✨ [LEAD] Nuevo lead creado:', email);

    // TODO: Aquí podrías integrar:
    // 1. Enviar email de bienvenida
    // 2. Notificar a Vapi para llamada automática
    // 3. Agregar a lista de email marketing
    // 4. Notificar por Telegram/Slack

    return NextResponse.json({
      success: true,
      message: 'Lead creado correctamente',
      lead: newLead
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ [LEAD] Error al crear lead:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ==========================================
// 📤 GET: OBTENER LEADS (ADMIN)
// ==========================================

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    // TODO: Agregar autenticación de admin
    // const isAdmin = await verifyAdmin(request);
    // if (!isAdmin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

    const query: any = { source: 'formacion-astrologos' };
    if (status) query.status = status;

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Lead.countDocuments(query);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + leads.length < total
      }
    });

  } catch (error: any) {
    console.error('❌ [LEAD] Error al obtener leads:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}

// ==========================================
// 🔄 PATCH: ACTUALIZAR STATUS DE LEAD
// ==========================================

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { leadId, status, notas, llamadaAgendada } = body;

    if (!leadId) {
      return NextResponse.json({
        success: false,
        error: 'leadId es requerido'
      }, { status: 400 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (notas !== undefined) updateData.notas = notas;
    if (llamadaAgendada) updateData.llamadaAgendada = new Date(llamadaAgendada);

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      updateData,
      { new: true }
    );

    if (!lead) {
      return NextResponse.json({
        success: false,
        error: 'Lead no encontrado'
      }, { status: 404 });
    }

    console.log('📝 [LEAD] Lead actualizado:', lead.email, '-> status:', status);

    return NextResponse.json({
      success: true,
      message: 'Lead actualizado correctamente',
      lead
    });

  } catch (error: any) {
    console.error('❌ [LEAD] Error al actualizar lead:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Error interno del servidor'
    }, { status: 500 });
  }
}
