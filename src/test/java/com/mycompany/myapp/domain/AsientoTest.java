package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AsientoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AsientoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Asiento.class);
        Asiento asiento1 = getAsientoSample1();
        Asiento asiento2 = new Asiento();
        assertThat(asiento1).isNotEqualTo(asiento2);

        asiento2.setId(asiento1.getId());
        assertThat(asiento1).isEqualTo(asiento2);

        asiento2 = getAsientoSample2();
        assertThat(asiento1).isNotEqualTo(asiento2);
    }
}
