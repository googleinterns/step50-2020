package com.google.sps;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import com.google.sps.models.Firebase;
import java.io.IOException;

@RunWith(JUnit4.class)
public final class FirebaseTest {

  @Test
  public void testRevisions() throws IOException {
    Firebase.getRevisions("-MACcfUH4mo-hTnodg0Q");
  }
}
