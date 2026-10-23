import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await req.json();
    const { 
      email, name, razonSocial, nif, phone, urlClientify,
      planId, personName, address, postalCode, city, province, country,
      stripeSubscriptionId, stripeCustomerId, stripeCurrentPeriodEnd,
      hasIaGoods,
      hasPosMode
    } = body;

    const userId = parseInt(id);

    // Update user and profile
    const result = await prisma.$transaction(async (tx) => {
      const userData = {};
      if (email !== undefined) userData.email = email;
      if (name !== undefined) userData.name = name;

      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: userId },
          data: userData
        });
      }

      const profileData = {};
      if (razonSocial !== undefined) profileData.razonSocial = razonSocial;
      if (nif !== undefined) profileData.nif = nif;
      if (phone !== undefined) profileData.phone = phone;
      if (urlClientify !== undefined) profileData.urlClientify = urlClientify;
      if (personName !== undefined) profileData.personName = personName;
      if (address !== undefined) profileData.address = address;
      if (postalCode !== undefined) profileData.postalCode = postalCode;
      if (city !== undefined) profileData.city = city;
      if (province !== undefined) profileData.province = province;
      if (country !== undefined) profileData.country = country;
      if (planId !== undefined) profileData.planId = planId || null;
      if (stripeSubscriptionId !== undefined) profileData.stripeSubscriptionId = stripeSubscriptionId || null;
      if (stripeCustomerId !== undefined) profileData.stripeCustomerId = stripeCustomerId || null;
      if (stripeCurrentPeriodEnd !== undefined) profileData.stripeCurrentPeriodEnd = stripeCurrentPeriodEnd || null;
      if (hasIaGoods !== undefined) profileData.hasIaGoods = Boolean(hasIaGoods);
      if (hasPosMode !== undefined) profileData.hasPosMode = Boolean(hasPosMode);

      if (Object.keys(profileData).length > 0) {
        await tx.clientProfile.update({
          where: { userId: userId },
          data: profileData
        });
      }

      return true;
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
