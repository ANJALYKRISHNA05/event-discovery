// Automated End-to-End API and Flow Verification Script
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting Comprehensive API & Flow Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`);
      failed++;
    }
  }

  try {
    // Test 1: GET /api/events (Discovery listing)
    console.log('1. Testing GET /api/events (Catalog & Pagination)...');
    const res1 = await fetch(`${BASE_URL}/api/events?limit=6`);
    const data1 = await res1.json();
    assert(res1.status === 200, 'GET /api/events returns HTTP 200');
    assert(data1.success === true, 'Response has success=true');
    assert(Array.isArray(data1.events) && data1.events.length > 0, `Returned ${data1.events?.length} events`);
    assert(data1.pagination && data1.pagination.total >= 12, `Total count is ${data1.pagination?.total}`);
    assert(data1.facets && data1.facets.categories.length > 0, 'Facets categories aggregated');

    // Test 2: Search and filtering
    console.log('\n2. Testing Search and Multi-filter queries...');
    const resSearch = await fetch(`${BASE_URL}/api/events?search=Neural`);
    const dataSearch = await resSearch.json();
    assert(resSearch.status === 200, 'Search by keyword returns 200');
    assert(dataSearch.events.some(e => e.name.includes('Neural')), 'Search found matching event name');

    const resFilter = await fetch(`${BASE_URL}/api/events?category=Healthcare&status=UPCOMING`);
    const dataFilter = await resFilter.json();
    assert(resFilter.status === 200, 'Filter by Category + Status returns 200');
    assert(dataFilter.events.every(e => e.category === 'Healthcare' && e.status === 'UPCOMING'), 'All filtered events match Category & Status');

    // Test 3: GET /api/stats (Admin KPI analytics)
    console.log('\n3. Testing GET /api/stats (Admin KPIs)...');
    const resStats = await fetch(`${BASE_URL}/api/stats`);
    const dataStats = await resStats.json();
    assert(resStats.status === 200, 'GET /api/stats returns 200');
    assert(dataStats.stats.totalEvents >= 12, `Admin reports totalEvents: ${dataStats.stats?.totalEvents}`);
    assert(dataStats.stats.upcomingCount > 0, `Admin reports upcomingCount: ${dataStats.stats?.upcomingCount}`);
    assert(dataStats.stats.uniqueCities > 0, `Admin reports uniqueCities: ${dataStats.stats?.uniqueCities}`);

    // Test 4: POST /api/events (Create Event CRUD)
    console.log('\n4. Testing POST /api/events (Create Event)...');
    const newEventPayload = {
      name: 'E2E Autonomous Agents Summit 2026',
      description: 'Comprehensive annual expo on multi-agent intelligence and autonomous task automation.',
      category: 'Technology',
      industry: 'AI & Robotics',
      startDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 32).toISOString(),
      venue: 'Austin Convention Center',
      city: 'Austin',
      country: 'United States',
      organizer: 'Agentic Research Lab',
      website: 'https://autonomousagentssummit.org',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
      status: 'UPCOMING',
    };

    const resCreate = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEventPayload),
    });
    const dataCreate = await resCreate.json();
    assert(resCreate.status === 201, 'POST /api/events returns HTTP 201 Created');
    assert(dataCreate.success === true, 'Create response has success=true');
    assert(dataCreate.event && dataCreate.event.id, `Created event with ID: ${dataCreate.event?.id}`);

    const createdId = dataCreate.event?.id;

    // Test 5: GET /api/events/:id (Fetch single event)
    console.log('\n5. Testing GET /api/events/:id (Read Single)...');
    const resGetOne = await fetch(`${BASE_URL}/api/events/${createdId}`);
    const dataGetOne = await resGetOne.json();
    assert(resGetOne.status === 200, 'GET /api/events/:id returns HTTP 200');
    assert(dataGetOne.event.name === newEventPayload.name, 'Fetched event name matches');
    assert(dataGetOne.event.city === 'Austin', 'Fetched event city matches');
    assert(Array.isArray(dataGetOne.relatedEvents), 'Related events array returned');

    // Test 6: PUT /api/events/:id (Update Event CRUD)
    console.log('\n6. Testing PUT /api/events/:id (Update Event)...');
    const updatedPayload = {
      ...newEventPayload,
      name: 'E2E Autonomous Agents Summit 2026 [UPDATED]',
      status: 'ONGOING',
    };
    const resUpdate = await fetch(`${BASE_URL}/api/events/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPayload),
    });
    const dataUpdate = await resUpdate.json();
    assert(resUpdate.status === 200, 'PUT /api/events/:id returns HTTP 200');
    assert(dataUpdate.event.name.includes('[UPDATED]'), 'Updated event name verified');
    assert(dataUpdate.event.status === 'ONGOING', 'Updated event status is ONGOING');

    // Test 7: Validation Error Handling (Zod)
    console.log('\n7. Testing Input Validation Error Handling (400 Bad Request)...');
    const invalidPayload = {
      name: 'X', // too short (< 3)
      description: 'Short',
      category: '',
      website: 'not-a-url',
    };
    const resInvalid = await fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });
    const dataInvalid = await resInvalid.json();
    assert(resInvalid.status === 400, 'Invalid payload returns HTTP 400 Bad Request');
    assert(dataInvalid.success === false, 'Invalid response indicates failure');

    // Test 8: DELETE /api/events/:id (Delete Event CRUD)
    console.log('\n8. Testing DELETE /api/events/:id (Delete Event)...');
    const resDelete = await fetch(`${BASE_URL}/api/events/${createdId}`, {
      method: 'DELETE',
    });
    const dataDelete = await resDelete.json();
    assert(resDelete.status === 200, 'DELETE /api/events/:id returns HTTP 200');
    assert(dataDelete.success === true, 'Delete response indicates success');

    // Verify deletion (404)
    const resVerifyDeleted = await fetch(`${BASE_URL}/api/events/${createdId}`);
    assert(resVerifyDeleted.status === 404, 'Deleted event now returns HTTP 404 Not Found');

    // Test 9: POST /api/seed (Reset / Re-seed)
    console.log('\n9. Testing POST /api/seed (Reset Demo Data)...');
    const resSeed = await fetch(`${BASE_URL}/api/seed`, { method: 'POST' });
    const dataSeed = await resSeed.json();
    assert(resSeed.status === 200, 'POST /api/seed returns HTTP 200');
    assert(dataSeed.count === 12, 'Re-seeded 12 events');

    console.log('\n=============================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=============================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
