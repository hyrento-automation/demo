import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { BrandConfig } from '@/src/lib/brand'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0D9B84',
  },
  headerLeft: {
    flexDirection: 'column',
    maxWidth: 320,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D9B84',
    marginBottom: 4,
  },
  refNumber: {
    fontSize: 11,
    color: '#333',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontSize: 9,
    color: '#666',
    width: 120,
  },
  value: {
    fontSize: 9,
    color: '#111',
    fontWeight: 'bold',
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 12,
  },
  priceBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: 9,
    color: '#555',
  },
  priceValue: {
    fontSize: 9,
    color: '#111',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0D9B84',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D9B84',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: '#888',
    marginBottom: 2,
  },
})

interface ReceiptPDFProps {
  bookingRef: string
  driver: any
  vehicle: any
  searchParams: any
  days: number
  total: number
  brand?: BrandConfig
}

const ReceiptPDF = ({ bookingRef, driver, vehicle, searchParams, days, total, brand }: ReceiptPDFProps) => {
  const brandName = brand?.name?.toUpperCase() || 'HYRENTO CAR RENTAL'
  const brandAddress = brand?.address || brand?.locationSummary || `${brand?.city || ''}, ${brand?.country || ''}`.trim()
  const currencySymbol = brand?.currency || 'MUR'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>{brandName}</Text>
            <Text style={styles.brandSub}>{brandAddress}</Text>
            <Text style={styles.brandSub}>Phone: {brand?.phone || ''} | Email: {brand?.email || ''}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.receiptTitle}>BOOKING INVOICE</Text>
            <Text style={styles.refNumber}>Ref: {bookingRef || 'HYR-2026-CONFIRMED'}</Text>
            <Text style={styles.brandSub}>Date: {new Date().toLocaleDateString('en-GB')}</Text>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{driver?.title} {driver?.firstName} {driver?.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{driver?.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{driver?.phone}</Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle:</Text>
            <Text style={styles.value}>{vehicle?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{vehicle?.category || 'Standard'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transmission:</Text>
            <Text style={styles.value}>{vehicle?.transmission || 'Automatic'}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <Text style={styles.label}>Pickup Location:</Text>
            <Text style={styles.value}>{searchParams?.pickupLocation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup Date & Time:</Text>
            <Text style={styles.value}>
              {searchParams?.pickupDate ? new Date(searchParams.pickupDate).toLocaleDateString('en-GB') : ''} @ {searchParams?.pickupTime}
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Drop-off Location:</Text>
            <Text style={styles.value}>{searchParams?.dropoffLocation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Drop-off Date & Time:</Text>
            <Text style={styles.value}>
              {searchParams?.dropoffDate ? new Date(searchParams.dropoffDate).toLocaleDateString('en-GB') : ''} @ {searchParams?.dropoffTime}
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Rental Duration</Text>
              <Text style={styles.priceValue}>{days} Days</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Vehicle Rate</Text>
              <Text style={styles.priceValue}>{currencySymbol} {(vehicle?.pricePerDay * days).toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{currencySymbol} {total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for choosing {brand?.name || 'Hyrento'}.</Text>
          <Text style={styles.footerText}>For support, call {brand?.phone || ''} or email {brand?.email || ''}.</Text>
          <Text style={styles.footerText}>{brandAddress}</Text>
        </View>

      </Page>
    </Document>
  )
}

export default ReceiptPDF
