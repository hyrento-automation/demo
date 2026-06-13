import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Define default styles
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
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  brandSub: {
    fontSize: 10,
    color: '#666',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D9B84',
    marginBottom: 4,
  },
  refNumber: {
    fontSize: 12,
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: '#666',
    width: 120,
  },
  value: {
    fontSize: 10,
    color: '#111',
    fontWeight: 'bold',
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 15,
  },
  priceBreakdown: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: '#555',
  },
  priceValue: {
    fontSize: 10,
    color: '#111',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D9B84',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 8,
    color: '#888',
  }
})

interface ReceiptPDFProps {
  bookingRef: string
  driver: any
  vehicle: any
  searchParams: any
  days: number
  total: number
}

const ReceiptPDF = ({ bookingRef, driver, vehicle, searchParams, days, total }: ReceiptPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandName}>{process.env.NEXT_PUBLIC_BRAND_NAME?.toUpperCase() || 'CAR HIRE MAURITIUS'}</Text>
          <Text style={styles.brandSub}>Premium Rental Service</Text>
          <Text style={styles.brandSub}>SSR International Airport, Plaine Magnien</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.receiptTitle}>BOOKING RECEIPT</Text>
          <Text style={styles.refNumber}>Ref: {bookingRef || `${process.env.NEXT_PUBLIC_BOOKING_REF_PREFIX || 'CHM-'}XXXXXX`}</Text>
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
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Vehicle:</Text>
          <Text style={styles.value}>{vehicle?.name}</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Pickup Location:</Text>
          <Text style={styles.value}>{searchParams?.pickupLocation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pickup Date/Time:</Text>
          <Text style={styles.value}>
            {searchParams?.pickupDate ? new Date(searchParams.pickupDate).toLocaleDateString('en-GB') : ''} @ {searchParams?.pickupTime}
          </Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Drop-off Location:</Text>
          <Text style={styles.value}>{searchParams?.dropoffLocation}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Drop-off Date/Time:</Text>
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
            <Text style={styles.priceValue}>Rs {vehicle?.pricePerDay * days}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>Rs {total.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Thank you for choosing {process.env.NEXT_PUBLIC_BRAND_NAME || 'Car Hire Mauritius'}.</Text>
        <Text style={styles.footerText}>For support, please call {process.env.NEXT_PUBLIC_BRAND_PHONE || '+230 XXX XXXX'} or email {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@carhiremauritius.com'}</Text>
      </View>

    </Page>
  </Document>
)

export default ReceiptPDF
